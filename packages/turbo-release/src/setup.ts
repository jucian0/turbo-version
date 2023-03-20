import chalk from "chalk";
import { exit } from "process";
import { githubSetup } from "./github-setup";
import { npmSetup } from "./npm-setup";
import { publish } from "./publish";

export async function release(target: string) {
  try {
    await npmSetup();
    await githubSetup();

    if (target) {
      const packages = target.split(",");

      for (const pkg of packages) {
        await publish(pkg);
      }
    } else {
      await publish();
    }
  } catch (err: any) {
    console.log(chalk.red(err));
    exit(1);
  }
}
