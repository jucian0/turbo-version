import semver from "semver";
import { cwd } from "process";
import { getCommitsLength, lastMergeBranchName } from "@turbo-version/git";

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
    const recommended = genNexttagByBranchName(recommendation?.releaseType);
    const currentVersion =
      semver.parse(latestTag.replace(tagPrefix, "")) ?? "0.0.0";

    const amountCommits = getCommitsLength(path ?? cwd());

    if (latestTag && amountCommits === 0 && !type) {
      return null;
    }

    const next = semver.inc(currentVersion, type ?? recommended);

    if (!next) {
      throw Error();
    }
    return next.toString();
  } catch (error: any) {
    throw Error(`Failed to calculate version: ${error.message}`);
  }
}

function genNextTagByBranchName(schema: string[], currentVersion: string) {
  const branch = lastMergeBranchName();

  switch (branch) {
    case schema[0]:
      return `${currentVersion.at(0) + 1}.0.0`;
    case schema[1]:
      return `${currentVersion.at(0)}.${currentVersion.at(1) + 1}.0`;
    case schema[2]:
      return `${currentVersion.at(0)}.${currentVersion.at(1)}.${
        currentVersion.at(2) + 1
      }`;

    default:
      return currentVersion.toString();
  }
}
