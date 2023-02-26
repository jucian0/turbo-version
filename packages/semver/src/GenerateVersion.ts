import conventionalRecommendedBump from "conventional-recommended-bump";
import semver from "semver";

export async function generateVersion(
  currentVersion: string,
  preset: string
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      conventionalRecommendedBump({ preset }, (err, recommendation) => {
        if (err) {
          reject(err);
        }
        const type = recommendation.releaseType || "patch";
        const next = semver.inc(currentVersion, type) || currentVersion;
        resolve(next);
      });
    } catch (err) {
      reject(err);
    }
  });
}
