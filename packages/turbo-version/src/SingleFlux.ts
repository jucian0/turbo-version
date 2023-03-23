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

export async function singleFlux(config: Config, options: any) {
  const { preset, baseBranch: branch } = config;
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
      const version = await generateVersion({
        latestTag,
        preset,
        tagPrefix,
        type,
        path,
        name,
      });

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

        await gitProcess({ files: [path], nextTag, name, branch });
        log(["tag", `Git Tag successfully generated.`, name]);
      } else {
        log(["success", "There is no change since the last release.", name]);
      }
    }
  } catch (err: any) {
    log(["error", chalk.red(err.message), "Failure"]);
    exit(1);
  }
}
function cmd(): string {
  throw new Error("Function not implemented.");
}
