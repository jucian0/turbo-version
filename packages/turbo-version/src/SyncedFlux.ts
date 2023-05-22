import { cwd, exit } from "process";
import { formatTag, formatTagPrefix } from "./utils/FormatTag";
import { generateChangelog } from "./utils/GenerateChangelog";
import { generateVersion } from "./utils/GenerateVersion";
import { getLatestTag } from "./utils/GetLatestTag";
import { updatePackageVersion } from "./utils/UpdatePackageVersion";
import { gitProcess } from "@turbo-version/git";
import { Config } from "@turbo-version/setup";
import chalk from "chalk";
import { log } from "@turbo-version/log";
import { getPackagesSync } from "@manypkg/get-packages";
import { formatCommitMessage } from "./utils/TemplateString";

export async function syncedFlux(config: Config, type?: any) {
  try {
    const { packages } = getPackagesSync(cwd());

    const tagPrefix = formatTagPrefix({
      synced: config.synced,
    });
    const { preset } = config;

    const latestTag = await getLatestTag(tagPrefix);

    const version = await generateVersion({
      latestTag,
      preset,
      tagPrefix,
      type,
    });

    if (typeof version === "string") {
      log(["new", `New version calculated ${version}`, "All"]);
      const nextTag = formatTag({ tagPrefix, version });

      for (const pkg of packages) {
        const { name } = pkg.packageJson;
        const path = pkg.relativeDir;

        if (
          config.skip &&
          config.skip.some((p) => p === pkg.packageJson.name)
        ) {
          log(["skip", "Skipped", name]);
        } else {
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
        }
      }

      const commitMessage = formatCommitMessage({
        commitMessage: config.commitMessage,
        version,
      });

      await gitProcess({
        files: [cwd()],
        nextTag,
        commitMessage,
      });
      log(["tag", `Git Tag generated for ${nextTag}.`, "All"]);
    } else {
      log([
        "no_changes",
        "There are no changes since the last release.",
        "All",
      ]);
    }
  } catch (err: any) {
    log(["error", chalk.red(err.message), "Failure"]);
    exit(1);
  }
}
