import { promisify } from "util";
import conventionalRecommendedBump from "conventional-recommended-bump";
import semver from "semver";
import { getCommitsLength } from "./GitCommands";
import { log } from "./Log";
import { cwd } from "process";

const recommendedBumpAsync = promisify(conventionalRecommendedBump);

type Version = {
  latestTag: string;
  preset: string;
  tagPrefix: string;
  type?: semver.ReleaseType;
  pkgPath?: string;
  pkgName?: string;
};

export async function generateVersion({
  latestTag,
  preset,
  tagPrefix,
  type,
  pkgPath,
  pkgName,
}: Version) {
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

    const amountCommits = getCommitsLength(latestTag, pkgPath ?? cwd());

    if (latestTag && amountCommits === 0 && !type) {
      throw new Error("There is no change since the last release.");
    }

    const next = semver.inc(currentVersion, type ?? recommended);

    log({
      step: "calculate_version_success",
      message: `New version calculated: ${next}`,
      pkgName: pkgName ?? "Workspace",
    });
    if (!next) {
      return null;
    }
    return next.toString();
  } catch (error: any) {
    log({
      step: "failure",
      message: `Failed to calculate version: ${error.message}`,
      pkgName: pkgName ?? "Workspace",
    });
    return null;
  }
}
