import { promisify } from "node:util";
import gitSemverTags from "git-semver-tags";

export async function getLatestTag(tagPrefix: string) {
   return promisify<any, any>(gitSemverTags)({ tagPrefix }).then((versions) => {
      return versions[0] ?? "";
   });
}
