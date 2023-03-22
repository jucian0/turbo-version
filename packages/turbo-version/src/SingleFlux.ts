import { formatTag, formatTagPrefix } from "./utils/FormatTag";
import { generateChangelog } from "./utils/GenerateChangelog";
import { generateVersion } from "./utils/GenerateVersion";
import { getLatestTag } from "./utils/GetLatestTag";
import { updatePackageVersion } from "./utils/UpdatePackageVersion";
import { readJsonFile } from "@turbo-version/fs";
import { gitProcess } from "@turbo-version/git";
import { Config, PkgJson } from "@turbo-version/setup";
import { log } from "@turbo-version/log";
import { exit } from "process";
import chalk from "chalk";

export async function singleFlux(config: Config, options: any) {
  const { preset, baseBranch: branch } = config;
  const pkgNames: string[] = options.target.split(",");
  const type = options.bump;
  const pkgsJson = [];

  try {
    for (const pkg of config.packages) {
      const pkgJson = readJsonFile<PkgJson>(`${pkg}/package.json`);

      if (pkgNames.some((name) => name === pkgJson.name) && !config.synced) {
        pkgJson.path = pkg;
        pkgsJson.push(pkgJson);
      }
    }

    for (const json of pkgsJson) {
      const { name, path } = json;

      const tagPrefix = formatTagPrefix({
        tagPrefix: config.tagPrefix,
        name: json.name,
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
