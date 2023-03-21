import { cwd, exit } from "process";
import { formatTag, formatTagPrefix } from "./utils/FormatTag";
import { generateChangelog } from "./utils/GenerateChangelog";
import { generateVersion } from "./utils/GenerateVersion";
import { getLatestTag } from "./utils/GetLatestTag";
import { updatePackageVersion } from "./utils/UpdatePackageVersion";
import { readJsonFile } from "@turbo-version/fs";
import { gitProcess, createGitTag } from "@turbo-version/git";
import { Config, PkgJson } from "@turbo-version/setup";
import chalk from "chalk";
import { log } from "@turbo-version/log";

export async function syncedFlux(config: Config, type?: any) {
  try {
    const tagPrefix = formatTagPrefix({
      synced: config.synced,
    });
    const { preset, baseBranch: branch } = config;

    const latestTag = await getLatestTag(tagPrefix);

    const version = await generateVersion({
      latestTag,
      preset,
      tagPrefix,
      type,
    });

    if (typeof version === "string") {
      log(["new", `New version calculated`, version]);

      console.log(chalk.green(`Next version calculated ${version} \n`));
      const nextTag = formatTag({ tagPrefix, version });

      for (const pkg of config.packages) {
        const pkgJson = readJsonFile<PkgJson>(`${pkg}/package.json`);
        const name = pkgJson.name;

        await updatePackageVersion({ path: pkg, version, name });
        console.log(chalk.white(`Package version updated for ${name}\n`));

        await generateChangelog({
          tagPrefix,
          preset,
          path: pkg,
          version,
          name,
        });
        log(["paper", `Changelog generated`, name]);
        //console.log(chalk.white(`Changelog generated for ${name}\n`));
      }

      await gitProcess({ files: [cwd()], nextTag, branch });
      console.log(chalk.white(`Git Tag generated for ${nextTag}\n`));

      await createGitTag({
        tag: "latest",
        args: "--force",
      });
      console.log(chalk.white("Git Tag generated for `latest`\n"));
    } else {
      console.log(
        chalk.white("[ 🟢 ] - There is no change since the last release.")
      );
    }
  } catch (err: any) {
    console.log(chalk.red(err.message));
    exit(1);
  }
}
