import { exec } from "child_process";
import { existsSync, statSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import { promisify } from "util";

const promisifiedExec = promisify(exec);

const execAsync = function (command: string) {
  return promisifiedExec(command, { maxBuffer: 1024 * 1024 * 10 });
};

const execSync = function (command: string, args?: any) {
  return exec(command, { maxBuffer: 1024 * 1024 * 10, ...args });
};

type GitTagOptions = {
  tag: string;
  message?: string;
  annotated?: boolean;
  args?: string;
};

type GitCommit = {
  message: string;
  amend?: boolean;
  author?: string;
  date?: string;
};

type GitProcess = {
  files: string[];
  nextTag: string;
  commitMessage: string;
};

export async function pullBranch(branch: string) {
  await execAsync(`git pull origin ${branch}`);
}

export async function push(branch: string, { force }: any = {}) {
  await execAsync(`git push origin HEAD:${branch}`);
}

export async function pushTags() {
  await execAsync("git push origin --tags");
}

async function gitAdd(files: string[]) {
  const command = `git add ${files.join(" ")}`;

  return execAsync(command);
}

async function gitCommit(options: GitCommit) {
  const command = ["commit"];
  if (options.amend) {
    command.push("--amend");
  }
  if (options.author) {
    command.push(`--author="${options.author}"`);
  }
  if (options.date) {
    command.push(`--date="${options.date}"`);
  }
  command.push(`-m "chore: ${options.message}"`);
  command.push("--no-verify");

  return execAsync(`git ${command.join(" ")}`);
}

export async function createGitTag(options: GitTagOptions) {
  const { tag, message = "", args = "" } = options;
  const command = `git tag -a -m "${message}" ${tag} ${args}`;

  return execAsync(command);
}

export function getCommitsLength(pkgRoot: string) {
  try {
    const gitCommand = `git rev-list --count HEAD ^$(git describe --tags --abbrev=0) ${pkgRoot}`;
    const amount = execSync(gitCommand).toString().trim();

    return Number(amount);
  } catch {
    return 0;
  }
}

export async function getFoldersWithCommits() {
  try {
    const tag = await getLastTag();
    let gitCommand = "";
    if (tag) {
      gitCommand = `git log --pretty=format: --name-only ${tag}..HEAD | grep "/" | sort -u`;
    } else {
      gitCommand = `git log --pretty=format: --name-only | grep "/" | sort -u`;
    }
    const result = execSync(gitCommand);

    const folders = result.toString().trim().split("\n");
    return folders;
  } catch (error) {
    return [];
  }
}

export function isGitRepository(directory: string) {
  const gitDir = join(directory, ".git");

  if (!existsSync(gitDir)) {
    return false;
  }

  const stats = statSync(gitDir);
  if (!stats.isDirectory()) {
    return false;
  }

  try {
    execSync("git rev-parse --is-inside-work-tree", { cwd: directory });
    return true;
  } catch (error) {
    return false;
  }
}

async function getLastTag(): Promise<string | null> {
  try {
    const { stdout, stderr } = await execAsync(
      "git describe --abbrev=0 --tags"
    );

    if (stderr) {
      return null;
    }

    const lastTag = stdout.trim();
    return lastTag;
  } catch {
    return null;
  }
}

export async function gitProcess({
  files,
  nextTag,
  commitMessage,
}: GitProcess) {
  try {
    if (!isGitRepository(cwd())) {
      throw new Error(
        "Not a git repository (or any parent up to mount point /)"
      );
    }

    await gitAdd(files);

    await gitCommit({
      message: commitMessage,
    });

    const tagMessage = `New Version ${nextTag} generated at ${new Date().toISOString()}`;
    await createGitTag({
      tag: nextTag,
      message: tagMessage,
    });
  } catch (err: any) {
    console.log(err);
    throw new Error(`Failed to create new version: ${err.message}`);
  }
}

export function lastMergeBranchName() {
  try {
    const lastBranchName = execSync("git symbolic-ref --short HEAD", {
      encoding: "utf-8",
    });
    return lastBranchName.toString().trim();
  } catch (error: any) {
    console.error("Error while getting the last branch name:", error.message);
    return null;
  }
}
