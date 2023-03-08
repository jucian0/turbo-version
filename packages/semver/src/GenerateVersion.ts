import { promisify } from "util";
import conventionalRecommendedBump from "conventional-recommended-bump";
import semver from "semver";
import { getCommitsLength } from "./GitCommands";
import { log } from "./Log";

const recommendedBumpAsync = promisify(conventionalRecommendedBump);

export async function generateVersion(
  latestTag: string,
  preset: string,
  tagPrefix: string,
  type?: semver.ReleaseType,
  pkgPath?: string,
  pkgName?: string
): Promise<string> {
  try {
    const recommendation: any = await recommendedBumpAsync(
      Object.assign(
        {
          preset,
          tagPrefix,
        },
        pkgPath ? { lernaPackage: pkgName, path: pkgPath } : {}
      )
    );
    const recommended = recommendation?.releaseType;
    const currentVersion =
      semver.parse(latestTag.replace(tagPrefix, "")) ?? "0.0.0";

    if (latestTag && getCommitsLength(latestTag) === 0) {
      log({
        step: "nothing_changed",
        message: `There is no change since the last release.`,
        pkgName: pkgName ?? "Workspace",
      });
      throw new Error("There is no change since the last release.");
    }

    const next =
      semver.inc(currentVersion, type ?? recommended) ?? currentVersion;

    log({
      step: "calculate_version_success",
      message: `New version calculated: ${next}`,
      pkgName: pkgName ?? "Workspace",
    });
    return next.toString();
  } catch (error: any) {
    log({
      step: "calculate_version_failure",
      message: `Failed to calculate version: ${error.message}`,
      pkgName: pkgName ?? "Workspace",
    });
    throw error;
  }
}
