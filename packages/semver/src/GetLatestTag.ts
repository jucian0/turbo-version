import gitSemverTags from "git-semver-tags";
import { promisify } from "util";
import { Config } from "./Types";

export async function getLatestTag(tagPrefix: string) {
  return promisify<any, any>(gitSemverTags)({ tagPrefix }).then((versions) => {
    return versions[0] ?? "";
  });
}
