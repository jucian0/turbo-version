import { formatTag, formatTagPrefix } from "./utils/FormatTag";
import { generateChangelog } from "./utils/GenerateChangelog";
import { generateVersion } from "./utils/GenerateVersion";
import { getLatestTag } from "./utils/GetLatestTag";
import { updatePackageVersion } from "./utils/UpdatePackageVersion";
import { gitProcess } from "@turbo-version/git";
import { Config } from "@turbo-version/setup";
import { log } from "@turbo-version/log";
import { cwd, exit } from "process";
import chalk from "chalk";
import { getPackagesSync } from "@manypkg/get-packages";
import { formatCommitMessage } from "./utils/TemplateString";
import { generateVersionByBranchPattern } from "./utils/GenerateVersionByBranchPattern";

export async function singleFlux(config: Config, options: any) {
  const { preset, baseBranch, branchPattern } = config;
  const pkgNames: string[] = options.target.split(",");
  const type = options.bump;
  const { packages: pkgs } = getPackagesSync(cwd());

  try {
    const packages = pkgs.filter(
      (pkg) =>
        pkgNames.some((name) => name === pkg.packageJson.name) && !config.synced
    );

    for (const pkg of packages) {
      const { name } = pkg.packageJson;
      const path = pkg.relativeDir;
      const tagPrefix = formatTagPrefix({
        tagPrefix: config.tagPrefix,
        name,
        synced: config.synced,
      });

      const latestTag = await getLatestTag(tagPrefix);

      let version: string | null = null;

      if (config.versionStrategy === "branchPattern") {
        version = await generateVersionByBranchPattern({
          latestTag,
          tagPrefix,
          type,
          path,
          branchPattern,
          baseBranch,
        });
      } else {
        version = await generateVersion({
          latestTag,
          preset,
          tagPrefix,
          type,
          path,
          name,
        });
      }

      if (version && name && version && path) {
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

        const commitMessage = formatCommitMessage({
          commitMessage: config.commitMessage,
          version,
          name,
        });

        await gitProcess({
          files: [path],
          nextTag,
          commitMessage,
        });
        log(["tag", `Git Tag successfully generated.`, name]);
      } else {
        log([
          "no_changes",
          "There are no changes since the last release.",
          name,
        ]);
      }
    }
  } catch (err: any) {
    log(["error", chalk.red(err.message), "Failure"]);
    exit(1);
  }
}
