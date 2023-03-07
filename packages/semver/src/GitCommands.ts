import { exec, execSync } from "child_process";
import { existsSync, statSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import { promisify } from "util";
import { log } from "./Log";
import { GitCommitOptions, GitTagOptions } from "./Types";

const promisifiedExec = promisify(exec);

async function gitAdd(files: string[]) {
  const command = `git add ${files.join(" ")}`;
  return promisifiedExec(command);
}

async function gitCommit(options: GitCommitOptions) {
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

  return promisifiedExec(`git ${command.join(" ")}`);
}

async function createGitTag(options: GitTagOptions) {
  const { tag, message = "" } = options;
  const command = `git tag -a -m "${message}" ${tag}`;

  return promisifiedExec(command);
}

export async function gitPush(
  branchName: string,
  remoteName: string = "origin"
) {
  return promisifiedExec(`git push ${remoteName} ${branchName}`);
}

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

// export function getCommits(pkgPath: string): Promise<Commit[]> {
//   return promisifiedExec(`git log --format="%H %s" ${pkgPath}`, { cwd: cwd() })
//     .then(({ stdout }) => {
//       const commits = stdout
//         .split("\n")
//         .filter(Boolean)
//         .map((commit) => {
//           const [hash, message] = commit.split(" ");
//           return { hash, message };
//         });
//       return commits;
//     })
//     .catch((error) => {
//       throw error;
//     });
// }

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

export async function gitProcess(
  files: string[],
  nextTag: string,
  pkgName?: string
) {
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
  } catch (err: any) {
    throw new Error(`Failed to create new version: ${err.message}`);
  }
}
