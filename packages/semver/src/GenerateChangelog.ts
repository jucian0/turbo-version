import conventionalChangelog from "conventional-changelog";
import { getCommits } from "./GitCommands";

export async function generateChangelog(
  repoPath: string,
  packageName: string
): Promise<string> {
  const packageCommits = await getCommits(repoPath);
  const fromCommit = packageCommits[packageCommits.length - 1];
  const toCommit = packageCommits[0];

  const options = {
    preset: "angular",
    releaseCount: 1,
    outputUnreleased: true,
    pkg: { path: `packages/${packageName}/package.json` },
    from: fromCommit,
    to: toCommit,
  };

  return new Promise((resolve, reject) => {
    conventionalChangelog(options, {}, (error: any, changelog: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(changelog);
      }
    });
  });
}
