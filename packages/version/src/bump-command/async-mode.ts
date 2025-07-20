import { exit } from "node:process";
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
import { summarizePackages } from "../utils/dependents";
import { gitProcess } from "../utils/git";
import { log } from "../utils/log";

export async function asyncFlux(config: Config, type?: ReleaseType) {
  const { preset, baseBranch, branchPattern } = config;

  try {
    const packages = await summarizePackages(config);

    if (packages.length === 0) {
      log([
        "no_changes",
        "There are no changes since last release.",
        "All clean",
      ]);
      return;
    }

    console.log(
      chalk.cyan(
        `Working on ${packages
          .map((n: { packageJson: { name: string } }) =>
            chalk.hex("#FF1F57")(n.packageJson.name)
          )
          .toString()} package(s).\n`
      )
    );
    for (const pkg of packages) {
      const name = pkg.packageJson.name;
      const path = pkg.relativeDir;

      if (config.skip?.some((p) => p === pkg.packageJson.name)) {
        log(["skip", "Skipped", name]);
      } else {
        const tagPrefix = formatTagPrefix({
          tagPrefix: config.tagPrefix,
          name,
          sync: config.sync,
        });
        const latestTag = await getLatestTag(tagPrefix);

        let version: string | null = null;

        if (config.versionStrategy === "branchPattern") {
          version = await generateVersionByBranchPattern({
            latestTag,
            tagPrefix,
            type: type ?? (pkg.type as ReleaseType),
            path,
            branchPattern,
            baseBranch,
            prereleaseIdentifier: config.prereleaseIdentifier,
          });
        } else {
          version = await generateVersion({
            latestTag,
            preset,
            tagPrefix,
            type: type ?? (pkg.type as ReleaseType),
            path,
            name,
            prereleaseIdentifier: config.prereleaseIdentifier,
          });
        }

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
          log(["list", "Changelog generated", name]);

          const commitMessage = formatCommitMessage({
            commitMessage: config.commitMessage,
            version,
            name,
          });

          await gitProcess({
            files: [`${path}/package.json`, `${path}/CHANGELOG.md`],
            nextTag,
            commitMessage,
            skipHooks: config.skipHooks,
          });

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
