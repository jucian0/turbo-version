import chalk from "chalk";
import { cwd } from "process";
import { fileExist, promisify } from "./utils";
import { writeFile } from "fs/promises";

type GHCredentials = {
  ghUser: string;
  ghToken: string;
};

async function writeNETRC(options: GHCredentials) {
  return writeFile(
    `${cwd()}/.netrc`,
    `machine github.com\nlogin github-actions[bot]\npassword ${options.ghToken}`
  ).catch(() => new Error("Error writing `.netrc` file."));
}

async function setupUser(userName: string, userEmail: string) {
  await promisify(`git config --global user.name '${userName}'`);
  await promisify(`git config --global user.email '${userEmail}'`);
}

export async function githubSetup() {
  if (fileExist(`${cwd()}/.netrc`)) {
    console.log(
      chalk.cyan(
        "We identify a .npmrc file, we are going to use it, if you want to use a custom configuration, jut remove it, and let us do it for you"
      )
    );
    return;
  }

  const GH_TOKEN = process.env.GH_TOKEN;
  const GH_USER =
    process.env.GH_USER ??
    "github-actions[bot], github-actions[bot]@users.noreply.github.com, ";

  if (!GH_TOKEN) {
    throw Error(
      "Could not find the GH_TOKEN var, provid it by adding an env var name `GH_TOKEN`"
    );
  }

  if (!GH_USER) {
    console.log(
      chalk.cyan(
        "We could not find the GH_USER env var, we are asuming you want to the default action bot. If it is not the case, provide us a env var name `GH_USER`"
      )
    );
  }

  await writeNETRC({
    ghUser: GH_USER,
    ghToken: GH_TOKEN,
  });

  const [userName, userEmail] = GH_USER.split(",");

  await setupUser(userName, userEmail);
}
