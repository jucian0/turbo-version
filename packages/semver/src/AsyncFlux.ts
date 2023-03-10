import { readJsonFile } from "./FileSystem";
import { formatTag, formatTagPrefix } from "./FormatTag";
import { generateChangelog } from "./GenerateChangelog";
import { generateVersion } from "./GenerateVersion";
import { getLatestTag } from "./GetLatestTag";
import { getFoldersWithCommits, gitProcess } from "./GitCommands";
import { log } from "./Log";
import { filterPackages, getDependents } from "./GetDependents";
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
    message: `Working on ${affectedPackages
      .map((n) => n.package.name)
      .toString()} packages.`,
    pkgName: "Workspace",
  });

  for (const pkg of affectedPackages) {
    const pkgName = pkg.package.name;
    const pkgPath = pkg.path;
    const dependents = getDependents(
      config.packages.filter((p) => p !== pkgPath),
      pkgName
    );

    console.log(dependents, pkgName);

    // move this line to filterPackages, to return an object with basic information instead of just a path
    try {
      const tagPrefix = formatTagPrefix({
        tagPrefix: config.tagPrefix,
        pkgName,
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
    } catch (err: any) {}
  }
}
