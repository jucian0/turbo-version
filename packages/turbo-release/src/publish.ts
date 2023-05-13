import { exec } from "child_process";
import { cwd } from "process";
import { promisify } from "util";

const promisifiedExec = promisify(exec);
const execAsync = function (command: string) {
  return promisifiedExec(command, { maxBuffer: 1024 * 500 });
};

export async function publish(tool: string, path = "") {
  const command = `${tool} publish ${cwd()}/${path}`;
  await execAsync("git status");
  return execAsync(command);
}
