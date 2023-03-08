import * as fs from "fs";
import { fileExist } from "./FileSystem";
import { log } from "./Log";
import { extractPgkName, resolvePkgPath } from "./Utils";

type PackageVersion = {
  pkgPath: string;
  version: string;
};
export function updatePackageVersion({ pkgPath, version }: PackageVersion) {
  const packageJsonPath = resolvePkgPath(`${pkgPath}/package.json`);
  return new Promise<void>((resolve, reject) => {
    if (!fileExist(packageJsonPath)) {
      log({
        step: "failure",
        message:
          "Could not find the package.json file, make sure your `semver.config.json` is right configured!",
        pkgName: extractPgkName(pkgPath),
      });
      reject();
    }

    fs.readFile(packageJsonPath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      }

      const packageJson = JSON.parse(data);
      packageJson.version = version;

      fs.writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        "utf8",
        (err) => {
          if (err) {
            return reject(err);
          }

          log({
            step: "package_json_success",
            message: `Packages info updated`,
            pkgName: extractPgkName(pkgPath),
          });
          resolve();
        }
      );
    });
  });
}

// export function updateAllPackagesVersion(
//   packages: string[],
//   nextVersion: string
// ): Promise<boolean> {
//   return new Promise((resolve, reject) => {
//     packages.forEach(async (pkgPath) => {
//       try {
//         await updatePackageVersion(pkgPath, nextVersion, "", "", "", "");
//         resolve(true);
//       } catch (err) {
//         reject(err);
//       }
//     });
//   });
// }
