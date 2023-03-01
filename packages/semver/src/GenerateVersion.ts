import conventionalRecommendedBump from "conventional-recommended-bump";
import semver from "semver";
import { getCommitsLength } from "./GitCommands";
import { log } from "./Log";

export async function generateVersion(
  latestTag: string,
  preset: string,
  tagPrefix: string
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      conventionalRecommendedBump(
        { preset, tagPrefix },
        (err, recommendation) => {
          if (err) {
            reject(err);
          }
          const type = recommendation.releaseType ?? "patch";
          const currentVersion = semver.parse(latestTag.replace(tagPrefix, ""));

          if (!currentVersion || getCommitsLength(latestTag) === 0) {
            log({
              step: "nothing_changed",
              message: `There is no change since last release.`,
              projectName: "Workspace",
            });
            return reject("There is no change since last release.");
          }
          const next = semver.inc(currentVersion, type);
          resolve(next.toString());
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}
