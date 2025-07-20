import { constants, promises as fs, accessSync, readFileSync } from "node:fs";
import { cwd } from "node:process";

export function fileExist(filePath: string) {
   try {
      accessSync(filePath, constants.R_OK || constants.W_OK);
      return true;
   } catch (err) {
      return false;
   }
}

export async function readFile(filePath: string) {
   return readFileSync(filePath, { encoding: "utf-8" });
}

export async function writeFile(
   filePath: string,
   data: Parameters<typeof fs.writeFile>[1],
) {
   fs.writeFile(filePath, data, { encoding: "utf-8" });
}

export function resolvePkgPath(relativePath: string) {
   return `${cwd()}/${relativePath}`;
}
