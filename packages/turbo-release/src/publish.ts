import { exec } from "child_process";
import { promisify } from "util";

export async function publish(path?: string) {
  return promisify(exec)(`npm publish ${path ?? ""}`);
}
