import { readJsonFile } from "./FileSystem";
import { formatTag, formatTagPrefix } from "./FormatTag";
import { generateChangelog } from "./GenerateChangelog";
import { generateVersion } from "./GenerateVersion";
import { getLatestTag } from "./GetLatestTag";
import { gitProcess } from "./GitCommands";
import { Config } from "./Types";
import { updatePackageVersion } from "./UpdatePackageVersion";

export async function singleFlux(config: Config, options: any) {
  const { preset } = config;
  const pkgNames: string[] = options.target.split(",");
  const type = options.bump;
  const pkgsJson = [];

  for (const pkg of config.packages) {
    const pkgJson = await readJsonFile(`${pkg}/package.json`);

    if (pkgNames.some((name) => name === pkgJson.name)) {
      pkgJson.path = pkg;
      pkgsJson.push(pkgJson);
    }
  }

  for (const json of pkgsJson) {
    const pkgName = json.name;
    const pkgPath = json.path;

    const tagPrefix = formatTagPrefix({
      tagPrefix: config.tagPrefix,
      pkgName: json.name,
      synced: config.synced,
    });

    const latestTag = await getLatestTag(tagPrefix);
    const nextVersion = await generateVersion({
      latestTag,
      preset,
      tagPrefix,
      type,
      pkgPath,
      pkgName,
    });

    const nextTag = formatTag({ tagPrefix, version: nextVersion });

    await updatePackageVersion({ pkgPath, version: nextVersion });
    await generateChangelog({
      tagPrefix,
      preset,
      pkgPath,
      nextVersion,
      pkgName,
    });

    await gitProcess({ files: [pkgPath], nextTag, pkgName });
  }
}
