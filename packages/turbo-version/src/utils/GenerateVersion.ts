import { promisify } from "util";
import conventionalRecommendedBump from "conventional-recommended-bump";
import semver from "semver";
import { cwd } from "process";
import { getCommitsLength } from "@turbo-version/git";
import { log } from "@turbo-version/log";

const recommendedBumpAsync = promisify(conventionalRecommendedBump);

type Version = {
  latestTag: string;
  preset: string;
  tagPrefix: string;
  type?: semver.ReleaseType;
  path?: string;
  name?: string;
};

export async function generateVersion({
  latestTag,
  preset,
  tagPrefix,
  type,
  path,
  name,
}: Version) {
  try {
    const recommendation: any = await recommendedBumpAsync(
      Object.assign(
        {
          preset,
          tagPrefix,
        },
        path ? { lernaPackage: name, path } : {}
      )
    );
    const recommended = recommendation?.releaseType;
    const currentVersion =
      semver.parse(latestTag.replace(tagPrefix, "")) ?? "0.0.0";

    const amountCommits = getCommitsLength(path ?? cwd());

    if (latestTag && amountCommits === 0 && !type) {
      throw new Error("There is no change since the last release.");
    }

    const next = semver.inc(currentVersion, type ?? recommended);

    log({
      step: "calculate_version_success",
      message: `New version calculated: ${next}`,
      pkgName: name ?? "All",
    });
    if (!next) {
      return null;
    }
    return next.toString();
  } catch (error: any) {
    log({
      step: "failure",
      message: `Failed to calculate version: ${error.message}`,
      pkgName: name ?? "All",
    });
    return null;
  }
}
