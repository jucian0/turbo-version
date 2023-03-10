import { promises as fs, accessSync, constants, readFileSync } from "fs";

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

export function readJsonFile<T>(filePath: string): T {
  try {
    const data = readFileSync(filePath, { encoding: "utf-8" });
    return JSON.parse(data);
  } catch {
    return {} as T;
  }
}

export async function writeFile(
  filePath: string,
  data: Parameters<typeof fs.writeFile>[1]
) {
  fs.writeFile(filePath, data, { encoding: "utf-8" });
}
