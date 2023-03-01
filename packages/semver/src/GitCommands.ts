import { exec, execSync } from "child_process";
import { existsSync, statSync } from "fs";
import { join } from "path";
import { promisify } from "util";
import { Commit, GitCommitOptions, GitTagOptions } from "./Types";

export function getCommits(repoPath: string): Promise<Commit[]> {
  return new Promise<Commit[]>((resolve, reject) => {
    exec('git log --format="%H %s"', { cwd: repoPath }, (err, stdout) => {
      if (err) {
        return reject(err);
      }
      const commits = stdout
        .split("\n")
        .filter(Boolean)
        .map((commit) => {
          const [hash, message] = commit.split(" ");
          return { hash, message };
        });
      resolve(commits);
    });
  });
}

export function getCommitsLength(latestTag: string) {
  const amount = execSync(`git log ${latestTag}.. --oneline | wc -l`)
    .toString()
    .trim();

  return Number(amount);
}

export function isGitRepository(directory: string): boolean {
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

export function gitAdd(files: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const command = `git add ${files.join(" ")}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

export function gitCommit(options: GitCommitOptions): Promise<string> {
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
  command.push(`-m "${options.message}"`);

  command.push("--no-verify");

  return new Promise((resolve, reject) => {
    exec(`git ${command.join(" ")}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

export function createGitTag(options: GitTagOptions): Promise<void> {
  const { tag, message = "" } = options;
  const command = `git tag -a -m "${message}" ${tag}`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(stderr.trim());
        return;
      }
      resolve();
    });
  });
}

const execProcess = promisify(exec);

export async function gitPush(
  branchName: string,
  remoteName: string = "origin"
): Promise<void> {
  try {
    const { stdout, stderr } = await execProcess(
      `git push ${remoteName} ${branchName}`
    );
    if (stderr) {
      throw new Error(stderr);
    }
    console.log(stdout);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
  }
}

export async function gitPull(
  branchName: string,
  remoteName: string = "origin"
): Promise<void> {
  try {
    const { stdout, stderr } = await execProcess(
      `git pull ${remoteName} ${branchName}`
    );
    if (stderr) {
      throw new Error(stderr);
    }
    console.log(stdout);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
  }
}
