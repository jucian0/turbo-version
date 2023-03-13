import { readJsonFile } from "./utils/FileSystem";
import { formatTag, formatTagPrefix } from "./utils/FormatTag";
import { generateChangelog } from "./utils/GenerateChangelog";
import { generateVersion } from "./utils/GenerateVersion";
import { getLatestTag } from "./utils/GetLatestTag";
import { gitProcess } from "./utils/GitCommands";
import { Config, PkgJson } from "./Types";
import { updatePackageVersion } from "./utils/UpdatePackageVersion";

export async function singleFlux(config: Config, options: any) {
  const { preset, baseBranch: branch } = config;
  const pkgNames: string[] = options.target.split(",");
  const type = options.bump;
  const pkgsJson = [];

  for (const pkg of config.packages) {
    const pkgJson = readJsonFile<PkgJson>(`${pkg}/package.json`);

    if (pkgNames.some((name) => name === pkgJson.name)) {
      pkgJson.path = pkg;
      pkgsJson.push(pkgJson);
    }
  }

  for (const json of pkgsJson) {
    const {name, path} = json;

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
      const nextTag = formatTag({ tagPrefix, version });

      await updatePackageVersion({ path, version,name });
      await generateChangelog({
        tagPrefix,
        preset,
        path,
        version,
        name,
      });

      await gitProcess({ files: [path], nextTag, name, branch });
    }
  }
}
