import chalk from "chalk";
import { writeFile } from "fs/promises";
import { cwd } from "process";
import { fileExist } from "./utils";

type NPMRC = {
  npmURL: string;
  npmToken: string;
};

async function writeNPMRC(options: NPMRC) {
  const URL = options.npmURL;
  return writeFile(
    `${cwd()}/.npmrc`,
    `\n//${URL}/:_authToken=${options.npmURL}\n`
  ).catch(() => new Error("Could not write the `.npmrc` file."));
}

export async function npmSetup() {
  if (fileExist(`${cwd()}/.npmrc`)) {
    console.log(
      chalk.cyan(
        "We identify a .npmrc file, we are going to use it, if you want to use a custom configuration, jut remove it, and let us do it for you"
      )
    );
    return;
  }

  const NPM_TOKEN = process.env.NPM_TOKEN;
  const NPM_URL = process.env.NPM_URL ?? "registry.npmjs.org";

  if (!NPM_TOKEN) {
    throw Error(
      "Could not find the NPM_TOKEN var, provid it by adding an env var name `NPM_TOKEN`"
    );
  }

  if (!NPM_URL) {
    console.log(
      chalk.cyan(
        "We could not find the NPM_URL env var, we are asuming you want to release it in public NPM. If it is not the case, provide us a env var name `NPM_URL`"
      )
    );
  }

  await writeNPMRC({
    npmURL: NPM_URL,
    npmToken: NPM_TOKEN,
  });
}
