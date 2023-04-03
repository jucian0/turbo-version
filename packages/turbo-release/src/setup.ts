import { log } from "@turbo-version/log";
import { cwd, exit } from "process";
import { npmSetup } from "./npm-setup";
import { publish } from "./publish";
import { getPackagesSync } from "@manypkg/get-packages";
import chalk from "chalk";
import { isVersionPublished } from "./isVersionPublished";

type Options = {
  skip?: string;
  target?: string;
};

export async function release({ target, skip }: Options) {
  try {
    await npmSetup();

    const { packages, tool } = getPackagesSync(cwd());

    const targets = target?.split(",").map((t) => t.trim());
    const skips = skip?.split(",").map((t) => t.trim());

    const pkgs = packages.filter((pkg) => {
      if (target) {
        return targets?.some((t) => t === pkg.packageJson.name);
      }

      if (skip) {
        return skips?.every((t) => t !== pkg.packageJson.name);
      }
      return pkg;
    });

    console.log(
      chalk.cyan(
        `Working on ${pkgs
          .map((n) => chalk.hex("#FF1F57")(n.packageJson.name))
          .toString()} package(s).\n`
      )
    );

    for (const pkg of pkgs) {
      const isPublished = await isVersionPublished(
        pkg.packageJson.name,
        pkg.packageJson.version
      );
      if (!isPublished) {
        await publish(tool.type, pkg.relativeDir);
        log([
          "publish",
          `Successfully published ${pkg.packageJson.version}`,
          pkg.packageJson.name,
        ]);
      } else {
        log([
          "no_changes",
          `Version already published ${pkg.packageJson.version}`,
          pkg.packageJson.name,
        ]);
      }
    }
  } catch (err: any) {
    log(["error", err, "Release"]);
    exit(1);
  }
}
