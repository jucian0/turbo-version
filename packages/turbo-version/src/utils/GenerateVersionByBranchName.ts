import semver from "semver";
import { cwd } from "process";
import { getCommitsLength, lastMergeBranchName } from "@turbo-version/git";

type Version = {
  latestTag: string;
  tagPrefix: string;
  type?: semver.ReleaseType;
  path?: string;
  branchPattern: string[];
};

export async function generateVersionByBranchName({
  latestTag,
  tagPrefix,
  type,
  path,
  branchPattern,
}: Version) {
  try {
    const recommended = await genNextTagByBranchName(branchPattern);

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

async function genNextTagByBranchName(schema: string[]) {
  const branch = await lastMergeBranchName();

  console.log("generateVersionByBranchName", branch);

  if (schema[0] === branch) {
    return "major";
  }

  if (schema[1] === branch) {
    return "minor";
  }

  if (schema[2] === branch) {
    return "patch";
  }

  return "patch";
}
