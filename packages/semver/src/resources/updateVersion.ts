import * as fs from "fs";

function updatePackageVersion(
  packagePath: string,
  version: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fs.readFile(packagePath, "utf8", (err, data) => {
      if (err) {
        return reject(err);
      }

      const packageJson = JSON.parse(data);
      packageJson.version = version;

      fs.writeFile(
        packagePath,
        JSON.stringify(packageJson, null, 2),
        "utf8",
        (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        }
      );
    });
  });
}
