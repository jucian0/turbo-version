import { exec } from "child_process";
import { log } from "./Log";

export async function getLastTag(projectName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec("git describe --tags --abbrev=0", (err, data) => {
      if (err) {
        reject(err);
      }
      if (!data) {
        log({
          projectName,
          message: "Could not find any previous TAG, assuming v0.0.0",
          step: "warning",
        });
      }
      resolve(data.toString().trim());
    });
  });
}
