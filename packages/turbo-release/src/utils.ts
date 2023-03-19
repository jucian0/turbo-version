import * as fs from "fs";
import p from "child_process";
import u from "util";

export function fileExist(filePath: string) {
  try {
    fs.accessSync(filePath, fs.constants.R_OK || fs.constants.W_OK);
    return true;
  } catch (err) {
    return false;
  }
}

export function promisify(command: string) {
  const exec = u.promisify(p.exec);
  return exec(command);
}
