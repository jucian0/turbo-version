import { exec } from "node:child_process";
import { cwd } from "node:process";
import { promisify } from "node:util";

const promisifiedExec = promisify(exec);
const execAsync = (command: string) =>
   promisifiedExec(command, { maxBuffer: 1024 * 1024 * 10 });

export async function publish(tool: string, path = "") {
   const command = `${tool} publish ${cwd()}/${path}`;
   await execAsync("git status");
   return execAsync(command);
}
