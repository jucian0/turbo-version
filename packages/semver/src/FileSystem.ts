import { promises as fs } from "fs";

export async function fileExist(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath, fs.constants.R_OK || fs.constants.W_OK);
    return true;
  } catch (err) {
    return false;
  }
}

export function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, { encoding: "utf-8" });
}

export function readJsonFile(filePath: string) {
  return readFile(filePath).then((data) => JSON.parse(data));
}

export function writeFile(
  filePath: string,
  data: Parameters<typeof fs.writeFile>[1]
) {
  fs.writeFile(filePath, data, { encoding: "utf-8" });
}
