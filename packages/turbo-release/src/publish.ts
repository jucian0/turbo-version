import { exec } from "child_process";
import { promisify } from "util";

export async function publish(tool: string, path?: string) {
  const command = `${tool ?? "npm"} publish ${path ?? ""}`;
  await promisify(exec)("git status");
  return promisify(exec)(command);
}
