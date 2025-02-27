import { cwd, exit } from "node:process";
import { getPackagesSync } from "@manypkg/get-packages";
import { gitProcess } from "@turbo-version/git";
import { log } from "@turbo-version/log";
import type { Config } from "@turbo-version/setup";
import chalk from "chalk";
import { formatTag, formatTagPrefix } from "./utils/FormatTag";
import { generateChangelog } from "./utils/GenerateChangelog";
import { generateVersion } from "./utils/GenerateVersion";
import { generateVersionByBranchPattern } from "./utils/GenerateVersionByBranchPattern";
import { getLatestTag } from "./utils/GetLatestTag";
import { formatCommitMessage } from "./utils/TemplateString";
import { updatePackageVersion } from "./utils/UpdatePackageVersion";

export async function singleFlux(config: Config, options: any) {
   const { preset, baseBranch, branchPattern } = config;
   const pkgNames: string[] = options.target.split(",");
   const type = options.bump;
   const { packages: pkgs } = getPackagesSync(cwd());

   try {
      const packages = pkgs.filter(
         (pkg) =>
            pkgNames.some((name) => name === pkg.packageJson.name) &&
            !config.synced,
      ).filter(pkg => !config.skip?.some(sp => sp === pkg.packageJson.name))

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
               prereleaseIdentifier: config.prereleaseIdentifier,
            });
         } else {
            version = await generateVersion({
               latestTag,
               preset,
               tagPrefix,
               type,
               path,
               name,
               prereleaseIdentifier: config.prereleaseIdentifier,
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
               files: [`${path}/package.json`, `${path}/CHANGELOG.md`],
               nextTag,
               commitMessage,
               skipHooks: config.skipHooks,
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
