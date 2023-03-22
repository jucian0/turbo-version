import { formatTag, formatTagPrefix } from "./utils/FormatTag";
import { generateChangelog } from "./utils/GenerateChangelog";
import { generateVersion } from "./utils/GenerateVersion";
import { getLatestTag } from "./utils/GetLatestTag";
import { updatePackageVersion } from "./utils/UpdatePackageVersion";
import chalk from "chalk";
import { createGitTag, gitProcess } from "@turbo-version/git";
import { log } from "@turbo-version/log";
import { summarizePackages } from "@turbo-version/dependents";
import { Config } from "@turbo-version/setup";
import { exit } from "process";

export async function asyncFlux(config: Config, type?: any) {
  const { preset, baseBranch: branch } = config;

  try {
    const packages = await summarizePackages(config);

    if (packages.length === 0) {
      log(["success", `Nothing changed since last release.`, "All clean"]);
      return;
    }

    console.log(
      chalk.cyan(
        `Working on ${packages
          .map((n) => n.package.name)
          .toString()} package(s).\n`
      )
    );

    for (const pkg of packages) {
      const name = pkg.package.name;
      const path = pkg.path;

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

        await gitProcess({ files: [path], nextTag, name, branch });
        log(["tag", `Git Tag generated for ${nextTag}.`, name]);
      } else {
        log(["success", "There is no change since the last release.", name]);
      }
    }
  } catch (err: any) {
    log(["error", chalk.red(err.message), "Failure"]);
    exit(1);
  }
}
