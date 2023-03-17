import { cwd } from "process";
import * as fs from "fs";
import { Config } from "./Types";

export function setup(): Promise<Config> {
  const localProcess = cwd();
  return new Promise((resolve, reject) => {
    fs.readFile(`${localProcess}/turbov.config.json`, "utf-8", (err, data) => {
      if (err) {
        reject("Could not locate the `turbov.config.json file");
      }

      try {
        const config: Config = JSON.parse(data);
        resolve(config);
      } catch (err) {
        reject( Error('Could not locate the `turbov.config.json file`'));
      }
    });
  });
}
