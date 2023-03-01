import { generateVersion } from "./GenerateVersion";
import { getLastTag, getLastVersion } from "./GetLastVersion";
import { createGitTag, gitAdd, gitCommit } from "./GitCommands";
import { log } from "./Log";
import { Config } from "./Types";
import { updatePackageVersion } from "./UpdateVersion";

function updateAllPackagesVersion(
  packages: string[],
  nextVersion: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    packages.forEach(async (pkgPath) => {
      try {
        await updatePackageVersion(pkgPath, nextVersion);
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  });
}

export async function syncedFlux(config: Config) {
  try {
    const latestVersion = await getLastTag("Workspace");
    const nextVersion = await generateVersion(
      latestVersion,
      config.preset,
      config.tagPrefix
    );

    log({
      step: "calculate_version_success",
      message: `New Version calculated ${nextVersion}`,
      projectName: "Workspace",
    });

    await updateAllPackagesVersion(config.packages, nextVersion);
    log({
      step: "package_json_success",
      message: `Packages info updated`,
      projectName: "Workspace",
    });
    await gitAdd([`.`]);
    await gitCommit({
      message: `New version generated ${config.tagPrefix}${nextVersion}`,
    });
    await createGitTag({
      tag: `${config.tagPrefix}${nextVersion}`,
      message: `New Version ${new Date().toISOString()}`,
    });
    log({
      step: "tag_success",
      message: `New Version ${nextVersion}`,
      projectName: "Workspace",
    });
  } catch (err: any) {
    throw err;
  }
}
