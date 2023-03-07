import conventionalRecommendedBump from "conventional-recommended-bump";
import semver from "semver";
import { getCommitsLength } from "./GitCommands";
import { log } from "./Log";
import { extractPgkName } from "./Utils";

export async function generateVersion(
  latestTag: string,
  preset: string,
  tagPrefix: string,
  type?: any,
  pkgPath?: string
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      conventionalRecommendedBump(
        { preset, tagPrefix, path: pkgPath },
        (err, recommendation) => {
          if (err) {
            reject(err);
          }
          const recommended = recommendation?.releaseType;
          const currentVersion =
            semver.parse(latestTag.replace(tagPrefix, "")) ?? "0.0.0";

          if (latestTag && getCommitsLength(latestTag) === 0) {
            log({
              step: "nothing_changed",
              message: `There is no change since last release.`,
              pkgName: extractPgkName(pkgPath ?? "Workspace"),
            });
            return reject();
          }
          const next =
            semver.inc(currentVersion, type ?? recommended) ?? currentVersion;
          log({
            step: "calculate_version_success",
            message: `New Version calculated ${next}`,
            pkgName: extractPgkName(pkgPath ?? "Workspace"),
          });
          resolve(next.toString());
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}
