import { formatTag, formatTagPrefix } from "./utils/FormatTag";
import { generateChangelog } from "./utils/GenerateChangelog";
import { generateVersion } from "./utils/GenerateVersion";
import { getLatestTag } from "./utils/GetLatestTag";
import { updatePackageVersion } from "./utils/UpdatePackageVersion";
import chalk from "chalk";
import { gitProcess } from "@turbo-version/git";
import { log } from "@turbo-version/log";
import { summarizePackages } from "@turbo-version/dependents";
import { Config } from "@turbo-version/setup";
import { cwd, exit } from "process";

export async function asyncFlux(config: Config, type?: any) {
  const { preset, baseBranch: branch } = config;

  try {
    const packages = await summarizePackages(config);

    if (packages.length === 0) {
      log([
        "no_changes",
        `There are no changes since last release.`,
        "All clean",
      ]);
      return;
    }

    console.log(
      chalk.cyan(
        `Working on ${packages
          .map((n) => chalk.hex("#FF1F57")(n.packageJson.name))
          .toString()} package(s).\n`
      )
    );

    for (const pkg of packages) {
      const name = pkg.packageJson.name;
      const path = pkg.relativeDir;

      if(config.skip && config.skip.some(p=> p === pkg.packageJson.name)){
        log(["skip", "Skipped", name]);
      }else{
        const tagPrefix = formatTagPrefix({
          tagPrefix: config.tagPrefix,
          name,
          synced: config.synced,
        });
        const latestTag = await getLatestTag(tagPrefix);
        const version = await generateVersion({
          latestTag,
          preset,
          tagPrefix,
          type: type ?? pkg.type,
          path,
          name,
        });
  
        if (version) {
          log(["new", `New version calculated ${version}`, name]);
          const nextTag = formatTag({ tagPrefix, version });
          await updatePackageVersion({ path, version, name });
          log(["paper", "Package version updated", name]);
  
          await generateChangelog({
            tagPrefix,
            preset,
            path,
            version,
            name,
          });
          log(["list", `Changelog generated`, name]);
  
          await gitProcess({ files: [path], nextTag });
          log(["tag", `Git Tag generated for ${nextTag}.`, name]);
        } else {
          log([
            "no_changes",
            "There are no changes since the last release.",
            name,
          ]);
        }
      }
    }
  } catch (err: any) {
    log(["error", chalk.red(err.message), "Failure"]);
    exit(1);
  }
}
