import { cwd } from "node:process";
import { promisify } from "util";
import { getCommitsLength } from "@turbo-version/git";
import conventionalRecommendedBump from "conventional-recommended-bump";
import semver from "semver";

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
            path ? { lernaPackage: name, path } : {},
         ),
      );
      const recommended = recommendation?.releaseType;
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
