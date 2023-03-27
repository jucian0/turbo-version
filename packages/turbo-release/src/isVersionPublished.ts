import { exec } from "child_process";

export async function isVersionPublished(
  packageName: string,
  version: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    exec(
      `npm view ${packageName}@${version} version`,
      (error, stdout, stderr) => {
        if (error) {
          // The package or version does not exist or there was an error executing the command
          resolve(false);
        } else if (stdout.trim() === version) {
          // The specified version has been published
          resolve(true);
        } else {
          // The specified version has not been published
          resolve(false);
        }
      }
    );
  });
}
