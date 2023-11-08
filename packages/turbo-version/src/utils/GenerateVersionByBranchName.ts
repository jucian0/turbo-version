import semver from "semver";
import { cwd } from "process";
import { getCommitsLength, lastMergeBranchName } from "@turbo-version/git";

type Version = {
  latestTag: string;
  tagPrefix: string;
  type?: semver.ReleaseType;
  path?: string;
  branchPattern: string[];
  baseBranch?: string;
};

export async function generateVersionByBranchName({
  latestTag,
  tagPrefix,
  type,
  path,
  branchPattern,
  baseBranch,
}: Version) {
  try {
    const recommended = await genNextTagByBranchName(branchPattern, baseBranch);

    console.log({ recommended });

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

async function genNextTagByBranchName(
  schema: string[],
  mainBranchName = "main"
) {
  const branch = await lastMergeBranchName(mainBranchName);

  if (branch?.includes(schema[0])) {
    return "major";
  }

  if (branch?.includes(schema[1])) {
    return "minor";
  }

  if (branch?.includes(schema[2])) {
    return "patch";
  }

  return "patch";
}
