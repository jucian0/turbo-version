//import { generateAllChangelogs } from "./GenerateChangelog";
import { readJsonFile } from "./FileSystem";
import { formatTagPrefix } from "./FormatTag";
import { generateVersion } from "./GenerateVersion";
import { getLatestTag } from "./GetLatestTag";
import { gitProcess } from "./GitCommands";
import { log } from "./Log";
import { Config } from "./Types";
//import { updateAllPackagesVersion } from "./UpdatePackageVersion";

export async function syncedFlux(config: Config, type?: string) {
  try {
    for (const pkg of config.packages) {
      const pkgJson = await readJsonFile(`${pkg}/package.json`);
      const pkgName = pkgJson.name;

      const tagPrefix = formatTagPrefix({
        tagPrefix: config.tagPrefix,
        pkgName: pkgName,
        synced: config.synced,
      });
    }
  } catch (err) {}
}
