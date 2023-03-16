import { cwd } from "process";
import { readJsonFile } from "./utils/FileSystem";
import { formatTag, formatTagPrefix } from "./utils/FormatTag";
import { generateChangelog } from "./utils/GenerateChangelog";
import { generateVersion } from "./utils/GenerateVersion";
import { getLatestTag } from "./utils/GetLatestTag";
import { gitProcess } from "./utils/GitCommands";
import { Config, PkgJson } from "./Types";
import { updatePackageVersion } from "./utils/UpdatePackageVersion";
import { publish } from "./utils/Publish";
import chalk from "chalk";

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

    if (version) {
      const nextTag = formatTag({ tagPrefix, version });

      for (const pkg of config.packages) {
        const pkgJson = readJsonFile<PkgJson>(`${pkg}/package.json`);
        const name = pkgJson.name;

        await updatePackageVersion({ path: pkg, version, name });
        await generateChangelog({
          tagPrefix,
          preset,
          path: pkg,
          version,
          name,
        });
      }
      await gitProcess({ files: [cwd()], nextTag, branch });

      if (config.publishConfig) {
        for (const pkg of config.packages) {
          const pkgJson = readJsonFile<PkgJson>(`${pkg}/package.json`);
          const name = pkgJson.name;

          await publish({
            packageManager: config.publishConfig.packageManager ?? "npm",
            path: pkg,
            tag: pkgJson.version,
            name,
          });
        }
      }
    }
  } catch (err) {}
}
