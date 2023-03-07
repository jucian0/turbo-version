import { readJsonFile } from "./FileSystem";
import { formatTag, formatTagPrefix } from "./FormatTag";
import { generateAllChangelogs, generateChangelog } from "./GenerateChangelog";
import { generateVersion } from "./GenerateVersion";
import { getLatestTag } from "./GetLatestTag";
import { gitProcess } from "./GitCommands";
import { Config } from "./Types";
import { updatePackageVersion } from "./UpdatePackageVersion";
import { extractPgkName } from "./Utils";

export async function byPackageFlux(config: Config, type?: string) {
  config.packages.forEach(async (pkg) => {
    try {
      // const pkgJson = await readJsonFile(`${pkg}/package.json`);

      const tagPrefix = formatTagPrefix({
        tagPrefix: config.tagPrefix,
        pkgName: extractPgkName(pkg),
        synced: config.synced,
      });

      const latestTag = await getLatestTag(tagPrefix);
      const nextVersion = await generateVersion(
        latestTag,
        config.preset,
        tagPrefix,
        undefined,
        pkg
      );

      const nextTag = formatTag({ tagPrefix, version: nextVersion });

      await updatePackageVersion(pkg, nextVersion);
      await generateChangelog(tagPrefix, config.preset, pkg, nextVersion);
      await gitProcess([pkg], nextTag, extractPgkName(pkg));
    } catch (err) {
      console.log(err);
    }
  });
}
