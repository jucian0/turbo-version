import gitSemverTags from "git-semver-tags";
import semver from "semver";
import { promisify } from "util";

export async function getLastVersion(tagPrefix: string) {
  const data = await promisify(gitSemverTags)();

  const tags = data.map((t) => t.replace(tagPrefix, ""));
}
