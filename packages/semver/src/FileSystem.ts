import { promises as fs, accessSync, constants } from "fs";

export function fileExist(filePath: string) {
  try {
    accessSync(filePath, constants.R_OK || constants.W_OK);
    return true;
  } catch (err) {
    return false;
  }
}

export async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, { encoding: "utf-8" });
}

export async function readJsonFile<T>(filePath: string) {
  return readFile(filePath).then((data) => JSON.parse(data) as T);
}

export async function writeFile(
  filePath: string,
  data: Parameters<typeof fs.writeFile>[1]
) {
  fs.writeFile(filePath, data, { encoding: "utf-8" });
}
