import conventionalRecommendedBump from "conventional-recommended-bump";
import { cwd } from "process";
import semver from "semver";

export async function generateVersion(
  currentVersion: string,
  preset: string,
  tagPrefix: string
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      conventionalRecommendedBump(
        { preset, tagPrefix, path: cwd() },
        (err, recommendation) => {
          if (err) {
            reject(err);
          }
          const type = recommendation.releaseType || "patch";
          const next = semver.inc(currentVersion, type) || currentVersion;
          resolve(next);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}
