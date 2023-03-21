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
      const nextTag = formatTag({ tagPrefix, version });

      for (const pkg of config.packages) {
        const pkgJson = readJsonFile<PkgJson>(`${pkg}/package.json`);
        const name = pkgJson.name;

        await updatePackageVersion({ path: pkg, version, name });
        log(["paper", "Package version updated", name]);

        await generateChangelog({
          tagPrefix,
          preset,
          path: pkg,
          version,
          name,
        });
        log(["list", `Changelog generated`, name]);
      }

      await gitProcess({ files: [cwd()], nextTag, branch });
      log(["tag", `Git Tag generated for ${nextTag}.`, "All"]);

      await createGitTag({
        tag: "latest",
        args: "--force",
      });
      log([
        "tag",
        "Git Tag generated for `latest` This tag is used to calculate next version.",
        "All",
      ]);
    } else {
      log(["success", "There is no change since the last release.", "All"]);
    }
  } catch (err: any) {
    log(["error", chalk.red(err.message), "All"]);
    exit(1);
  }
}
