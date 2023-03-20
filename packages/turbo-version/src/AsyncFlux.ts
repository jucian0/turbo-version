import { formatTag, formatTagPrefix } from "./utils/FormatTag";
import { generateChangelog } from "./utils/GenerateChangelog";
import { generateVersion } from "./utils/GenerateVersion";
import { getLatestTag } from "./utils/GetLatestTag";
import { Config } from "./Types";
import { updatePackageVersion } from "./utils/UpdatePackageVersion";
import chalk from "chalk";
import { createGitTag, gitProcess } from "@turbo-version/git";
import { log } from "@turbo-version/log";
import { summarizePackages } from "@turbo-version/dependents";

export async function asyncFlux(config: Config, type?: any) {
  const { preset, baseBranch: branch } = config;

  try {
    const packages = await summarizePackages(config);

    if (packages.length === 0) {
      log({
        step: "nothing_changed",
        message: `Nothing changed since last release.`,
        pkgName: "All",
      });
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
        const nextTag = formatTag({ tagPrefix, version });
        await updatePackageVersion({ path, version, name });
        await generateChangelog({
          tagPrefix,
          preset,
          path,
          version,
          name,
        });

        await gitProcess({ files: [path], nextTag, name, branch });
      }
    }
    await createGitTag({
      tag: "latest",
      args: "--force",
    });
  } catch (err) {
    return err;
  }
}
