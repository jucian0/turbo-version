import { exec } from "child_process";
import { cwd } from "process";
import { promisify } from "util";

export async function publish(tool: string, path = "") {
  const command = `${tool} publish ${cwd()}/${path}`;
  await promisify(exec)("git status");
  return promisify(exec)(command);
}
