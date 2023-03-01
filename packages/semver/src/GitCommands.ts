import { exec, execSync } from "child_process";
import { existsSync, statSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import { log } from "./Log";
import { Commit, GitCommitOptions, GitTagOptions } from "./Types";

function gitAdd(files: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const command = `git add ${files.join(" ")}`;
    exec(command, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

function gitCommit(options: GitCommitOptions): Promise<string> {
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

function createGitTag(options: GitTagOptions): Promise<void> {
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

//const execProcess = promisify(exec);

// export async function gitPush(
//   branchName: string,
//   remoteName: string = "origin"
// ): Promise<void> {
//   try {
//     const { stdout, stderr } = await execProcess(
//       `git push ${remoteName} ${branchName}`
//     );
//     if (stderr) {
//       throw new Error(stderr);
//     }
//     console.log(stdout);
//   } catch (error: any) {
//     console.error(`Error: ${error.message}`);
//   }
// }

//  async function gitPull(
//   branchName: string,
//   remoteName: string = "origin"
// ): Promise<void> {
//   try {
//     const { stdout, stderr } = await execProcess(
//       `git pull ${remoteName} ${branchName}`
//     );
//     if (stderr) {
//       throw new Error(stderr);
//     }
//     console.log(stdout);
//   } catch (error: any) {
//     console.error(`Error: ${error.message}`);
//   }
// }

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

export async function getLastTag(projectName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec("git describe --tags --abbrev=0", (err, data) => {
      if (err) {
        reject(err);
      }
      if (!data) {
        log({
          projectName,
          message: "Could not find any previous TAG, assuming v0.0.0",
          step: "warning",
        });
      }
      resolve(data.toString().trim());
    });
  });
}

export async function gitProcess(files: string[], nextTag: string) {
  try {
    if (!isGitRepository(cwd())) {
      throw Error("Not a git repository (or any parent up to mount point /)");
    }

    await gitAdd(files);
    await gitCommit({
      message: `New version generated ${nextTag}`,
    });
    await createGitTag({
      tag: nextTag,
      message: `New Version ${nextTag} generated at ${new Date().toISOString()}`,
    });
  } catch (err) {
    return err;
  }
}
