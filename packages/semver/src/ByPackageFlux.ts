import { readJsonFile } from "./FileSystem";
import { formatTag, formatTagPrefix } from "./FormatTag";
import { generateChangelog } from "./GenerateChangelog";
import { generateVersion } from "./GenerateVersion";
import { getLatestTag } from "./GetLatestTag";
import { gitProcess } from "./GitCommands";
import { Config } from "./Types";
import { updatePackageVersion } from "./UpdatePackageVersion";

export async function byPackageFlux(config: Config, type?: string) {
  for (const pkg of config.packages) {
    const pkgJson = await readJsonFile(`${pkg}/package.json`);
    const pkgName = pkgJson.name;
    try {
      const tagPrefix = formatTagPrefix({
        tagPrefix: config.tagPrefix,
        pkgName: pkgName,
        synced: config.synced,
      });

      const latestTag = await getLatestTag(tagPrefix);
      const nextVersion = await generateVersion(
        latestTag,
        config.preset,
        tagPrefix,
        undefined,
        pkg,
        pkgName
      );

      const nextTag = formatTag({ tagPrefix, version: nextVersion });

      await updatePackageVersion(pkg, nextVersion);
      await generateChangelog(
        tagPrefix,
        config.preset,
        pkg,
        nextVersion,
        pkgName
      );

      await gitProcess([pkg], nextTag, pkgName);
    } catch (err: any) {
      console.log(err);
    }
  }
}
