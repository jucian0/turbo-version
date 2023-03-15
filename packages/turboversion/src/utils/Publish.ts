import chalk from "chalk";
import { exec } from "child_process";
import { promisify } from "util";
import { log } from "./Log";

const promisifiedExec = promisify(exec);

type Publish = {
  packageManager: string;
  path: string;
  tag: string;
  name: string;
};

export async function publish({ packageManager, path, tag, name }: Publish) {
  const command = `${packageManager} publish ${path}`;

  return promisifiedExec(command)
    .then(() => {
      log({
        step: "publish_success",
        message: `Successfully published ${tag}`,
        pkgName: name,
      });
    })
    .catch((err) => {
      log({
        step: "failure",
        message: `Failure to publish the ${name} package.
        \n${chalk.red(err)}`,
        pkgName: name,
      });
      return err;
    });
}
