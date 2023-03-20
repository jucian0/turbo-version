import { fileExist, resolvePkgPath } from "@turbo-version/fs";
import { log } from "@turbo-version/log";
import * as fs from "fs";

type PackageVersion = {
  path: string;
  version: string;
  name: string;
};
export function updatePackageVersion({ path, version, name }: PackageVersion) {
  const packageJsonPath = resolvePkgPath(`${path}/package.json`);
  return new Promise<void>((resolve, reject) => {
    if (!fileExist(packageJsonPath)) {
      log({
        step: "failure",
        message:
          "Could not find the package.json file, make sure your `turbov.config.json` is right configured!",
        pkgName: name,
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
            pkgName: name,
          });
          resolve();
        }
      );
    });
  });
}
