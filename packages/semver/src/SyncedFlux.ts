import { cwd } from "process";
import { readJsonFile } from "./FileSystem";
import { formatTag, formatTagPrefix } from "./FormatTag";
import { generateChangelog } from "./GenerateChangelog";
import { generateVersion } from "./GenerateVersion";
import { getLatestTag } from "./GetLatestTag";
import { gitProcess } from "./GitCommands";
import { Config } from "./Types";
import { updatePackageVersion } from "./UpdatePackageVersion";

export async function syncedFlux(config: Config, type?: any) {
  try {
    const tagPrefix = formatTagPrefix({
      synced: config.synced,
    });
    const preset = config.preset;

    const latestTag = await getLatestTag(tagPrefix);

    const nextVersion = await generateVersion({
      latestTag,
      preset,
      tagPrefix,
      type,
    });
    const nextTag = formatTag({ tagPrefix, version: nextVersion });

    for (const pkg of config.packages) {
      const pkgJson = await readJsonFile(`${pkg}/package.json`);
      const pkgName = pkgJson.name;

      await updatePackageVersion({ pkgPath: pkg, version: nextVersion });
      await generateChangelog({
        tagPrefix,
        preset,
        pkgPath: pkg,
        nextVersion,
        pkgName,
      });
    }
    await gitProcess({ files: [cwd()], nextTag });
  } catch (err) {}
}
