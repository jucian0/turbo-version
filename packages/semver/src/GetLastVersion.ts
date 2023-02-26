import gitSemverTags from "git-semver-tags";
import semver from "semver";
import { promisify } from "util";

export async function getLastVersion(tagPrefix: string): Promise<string> {
  return new Promise((resolve, reject) => {
    gitSemverTags({ tagPrefix }, (err, data) => {
      if (err) {
        reject(err);
      }
      const versions = data
        .map((t) => t.replace(tagPrefix, ""))
        .filter((v) => {
          const prerelease = semver.prerelease(v);
          if (prerelease == null) {
            return true;
          }
          return false;
        });

      const [version] = versions.sort(semver.rcompare);
      resolve(version);
    });
  });
}
