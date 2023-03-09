import { readJsonFile } from "./FileSystem";
import { formatTag, formatTagPrefix } from "./FormatTag";
import { generateChangelog } from "./GenerateChangelog";
import { generateVersion } from "./GenerateVersion";
import { getLatestTag } from "./GetLatestTag";
import { gitProcess } from "./GitCommands";
import { Config, PkgJson } from "./Types";
import { updatePackageVersion } from "./UpdatePackageVersion";

export async function asyncFlux(config: Config, type?: any) {
  const { preset } = config;

  for (const pkg of config.packages) {
    const pkgJson = await readJsonFile<PkgJson>(`${pkg}/package.json`);
    const pkgName = pkgJson.name;
    try {
      const tagPrefix = formatTagPrefix({
        tagPrefix: config.tagPrefix,
        pkgName: pkgName,
        synced: config.synced,
      });

      const latestTag = await getLatestTag(tagPrefix);
      const nextVersion = await generateVersion({
        latestTag,
        preset,
        tagPrefix,
        type,
        pkgPath: pkg,
        pkgName,
      });

      const nextTag = formatTag({ tagPrefix, version: nextVersion });

      await updatePackageVersion({ pkgPath: pkg, version: nextVersion });
      await generateChangelog({
        tagPrefix,
        preset,
        pkgPath: pkg,
        nextVersion,
        pkgName,
      });

      await gitProcess({ files: [pkg], nextTag, pkgName });
    } catch (err: any) {}
  }
}
