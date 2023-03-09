import { readJsonFile } from "./FileSystem";
import { formatTag, formatTagPrefix } from "./FormatTag";
import { generateChangelog } from "./GenerateChangelog";
import { generateVersion } from "./GenerateVersion";
import { getLatestTag } from "./GetLatestTag";
import { getFoldersWithCommits, gitProcess } from "./GitCommands";
import { log } from "./Log";
import { filterPackages } from "./ResolveInternalDependencies";
import { Config, PkgJson } from "./Types";
import { updatePackageVersion } from "./UpdatePackageVersion";

export async function asyncFlux(config: Config, type?: any) {
  const { preset } = config;
  const affectedPackages = filterPackages(
    config.packages,
    getFoldersWithCommits()
  );

  log({
    step: "affected_packages",
    message: `Working on ${affectedPackages.toString()}`,
    pkgName: "Workspace",
  });

  for (const pkg of affectedPackages) {
    // move this line to filterPackages, to return an object with basic information instead of just a path
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
