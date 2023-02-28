import gitSemverTags from "git-semver-tags";
import semver from "semver";
import chalk from "chalk";
import { log } from "./Log";

export async function getLastVersion(
  tagPrefix: string,
  projectName: string
): Promise<string> {
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

      if (!version) {
        log(
          "warning",
          "Could not find any previous TAG, assuming v0.0.0",
          projectName
        );
      }

      resolve(version ?? "0.0.0");
    });
  });
}
