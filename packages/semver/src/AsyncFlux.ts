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
  const { preset, baseBranch: branch } = config;

  try {
    const packages = await summarizePackages(config);

    if (packages.length === 0 && !type) {
      log({
        step: "nothing_changed",
        message: `Nothing changed since last release.`,
        pkgName: "Workspace",
      });
      return;
    }
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
      const version = await generateVersion({
        latestTag,
        preset,
        tagPrefix,
        type: type ?? pkg.type,
        pkgPath,
        pkgName,
      });

      if (version) {
        const nextTag = formatTag({ tagPrefix, version });
        await updatePackageVersion({ pkgPath, version });
        await generateChangelog({
          tagPrefix,
          preset,
          pkgPath,
          version,
          pkgName,
        });

        await gitProcess({ files: [pkgPath], nextTag, pkgName, branch });
      }
    }
  } catch (err) {}
}
