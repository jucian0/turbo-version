import { cwd, exit } from "node:process";
import { getPackagesSync } from "@manypkg/get-packages";
import chalk from "chalk";
import type { ReleaseType } from "semver";
import { formatTag, formatTagPrefix } from "../utils/format-tag";
import { generateChangelog } from "../utils/generate-changelog";
import { generateVersion } from "../utils/generate-version";
import { generateVersionByBranchPattern } from "../utils/generate-version-by-branch-pattern";
import { getLatestTag } from "../utils/get-latest-tag";
import { formatCommitMessage } from "../utils/template-string";
import { updatePackageVersion } from "../utils/update-package-version";
import { Config } from "../setup";
import { gitProcess } from "../utils/git";
import { log } from "../utils/log";

export async function syncedFlux(config: Config, type?: ReleaseType) {
  try {
    const { packages } = getPackagesSync(cwd());

    const tagPrefix = formatTagPrefix({
      synced: config.synced,
    });
    const { preset, baseBranch, branchPattern } = config;

    const latestTag = await getLatestTag(tagPrefix);

    let version: string | null = null;
    if (config.versionStrategy === "branchPattern") {
      version = await generateVersionByBranchPattern({
        latestTag,
        tagPrefix,
        type,
        branchPattern,
        baseBranch,
        prereleaseIdentifier: config.prereleaseIdentifier,
      });
    } else {
      version = await generateVersion({
        latestTag,
        preset,
        tagPrefix,
        type,
        prereleaseIdentifier: config.prereleaseIdentifier,
      });
    }

    if (typeof version === "string") {
      log(["new", `New version calculated ${version}`, "All"]);
      const nextTag = formatTag({ tagPrefix, version });

      for (const pkg of packages) {
        const { name } = pkg.packageJson;
        const path = pkg.relativeDir;

        if (config.skip?.some((p) => p === pkg.packageJson.name)) {
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
          log(["list", "Changelog generated", name]);
        }
      }

      const commitMessage = formatCommitMessage({
        commitMessage: config.commitMessage,
        version,
      });

      await gitProcess({
        files: packages
          .filter(
            (pkg) => !config.skip?.some((sp) => sp === pkg.packageJson.name)
          )
          .map((path) => [
            `${path.relativeDir}/package.json`,
            `${path.relativeDir}/CHANGELOG.md`,
          ])
          .flat(),
        nextTag,
        commitMessage,
        skipHooks: config.skipHooks,
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
