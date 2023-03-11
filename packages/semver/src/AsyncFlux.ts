import { formatTag, formatTagPrefix } from "./FormatTag";
import { generateChangelog } from "./GenerateChangelog";
import { generateVersion } from "./GenerateVersion";
import { getLatestTag } from "./GetLatestTag";
import { gitProcess } from "./GitCommands";
import { log } from "./Log";
import { summarizePackages } from "./GetDependents";
import { Config } from "./Types";
import { updatePackageVersion } from "./UpdatePackageVersion";

export async function asyncFlux(config: Config, type?: any) {
  const { preset } = config;

  try {
    const packages = summarizePackages(config);
    // console.log(packages);
    log({
      step: "affected_packages",
      message: `Working on ${packages
        .map((n) => n.package.name)
        .toString()} packages.`,
      pkgName: "Workspace",
    });
    for (const pkg of packages) {
      const pkgName = pkg.package.name;
      const pkgPath = pkg.path;

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
        type: type ?? pkg.type,
        pkgPath,
        pkgName,
      });

      if (nextVersion) {
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
  } catch (err) {}
}
