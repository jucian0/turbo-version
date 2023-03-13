import { exec, execSync } from "child_process";
import { existsSync, statSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import { promisify } from "util";
import { log } from "./Log";

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
  pkgName?: string;
  branch: string;
};

type GitPush = {
  branch: string;
  remote: string;
};

const promisifiedExec = promisify(exec);

async function gitAdd(files: string[]) {
  const command = `git add ${files.join(" ")}`;

  return promisifiedExec(command);
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

  return promisifiedExec(`git ${command.join(" ")}`);
}

async function createGitTag(options: GitTagOptions) {
  const { tag, message = "", args = "" } = options;
  const command = `git tag -a -m "${message}" ${tag} ${args}`;

  return promisifiedExec(command);
}

export async function gitPush({ remote, branch }: GitPush) {
  const gitCommand = `git push ${remote} ${branch} --tags`;
  return promisifiedExec(gitCommand);
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
    const { stdout, stderr } = await promisifiedExec(
      "git describe --abbrev=0 --tags"
    );

    const lastTag = stdout.trim();
    return lastTag;
  } catch {
    return null;
  }
}

export async function gitProcess({
  files,
  nextTag,
  pkgName,
  branch,
}: GitProcess) {
  try {
    if (!isGitRepository(cwd())) {
      throw new Error(
        "Not a git repository (or any parent up to mount point /)"
      );
    }

    await gitAdd(files);
    await gitCommit({
      message: `New version generated ${nextTag}`,
    });

    const tagMessage = `New Version ${nextTag} generated at ${new Date().toISOString()}`;
    await createGitTag({
      tag: nextTag,
      message: tagMessage,
    });

    log({
      step: "tag_success",
      message: `New Tag version ${nextTag}`,
      pkgName: pkgName ?? "Workspace",
    });

    await gitPush({ remote: "origin", branch });

    log({
      step: "push_success",
      message: `Successfully pushed to remote branch ${branch}`,
      pkgName: pkgName ?? "Workspace",
    });

    log({
      step: "post_target_success",
      message: `Everything is done!!`,
      pkgName: pkgName ?? "Workspace",
    });
  } catch (err: any) {
    throw new Error(`Failed to create new version: ${err.message}`);
  }
}
