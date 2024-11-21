import { cwd } from "node:process";
import { getCommitsLength, lastMergeBranchName } from "@turbo-version/git";
import semver from "semver";

type Version = {
   latestTag: string;
   tagPrefix: string;
   type?: semver.ReleaseType;
   path?: string;
   branchPattern: string[];
   baseBranch?: string;
   prereleaseIdentifier?: string;
};

export async function generateVersionByBranchPattern({
   latestTag,
   tagPrefix,
   type,
   path,
   branchPattern,
   baseBranch,
   prereleaseIdentifier
}: Version) {
   try {
      const recommended = await genNextTagByBranchName(
         branchPattern,
         baseBranch,
      );

      const currentVersion =
         semver.parse(latestTag.replace(tagPrefix, "")) ?? "0.0.0";

      const amountCommits = getCommitsLength(path ?? cwd());

      if (latestTag && amountCommits === 0 && !type) {
         return null;
      }

      const next = semver.inc(currentVersion, type ?? recommended,
         prereleaseIdentifier);

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
   mainBranchName = "main",
) {
   const branch = await lastMergeBranchName(schema, mainBranchName);

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
