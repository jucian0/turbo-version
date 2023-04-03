import chalk from "chalk";
import { cwd } from "process";
import { promisify } from "util";
import { exec } from "child_process";

async function setupUser(userName: string, userEmail: string) {
  await promisify(exec)(`git config --global user.name '${userName}'`);
  await promisify(exec)(`git config --global user.email '${userEmail}'`);
}

export async function githubSetup() {
  const USERNAME = process.env.USERNAME;
  const EMAIL =
    process.env.EMAIL ??
    "github-actions[bot], github-actions[bot]@users.noreply.github.com, ";

  if (!USERNAME) {
    throw Error(
      "Could not find the GIT EMAIL var, provide it by adding an env var name `EMAIL`"
    );
  }

  if (!EMAIL) {
    throw Error(
      "Could not find the GIT USERNAME var, provide it by adding an env var name `EMAIL`"
    );
  }

  await setupUser(USERNAME, EMAIL);
}
