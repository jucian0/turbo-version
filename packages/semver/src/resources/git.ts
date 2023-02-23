import { Repo } from "git-repository";
import semver from "semver";
import conventionalRecommendedBump from "conventional-recommended-bump";

interface Commit {
  hash: string;
  message: string;
}

async function getCommits(repo: Repo): Promise<Commit[]> {
  const commits = await repo.exec('git log --format="%H %s"');
  return commits
    .split("\n")
    .filter(Boolean)
    .map((commit) => {
      const [hash, message] = commit.split(" ");
      return { hash, message };
    });
}

export async function determineNextVersion(
  repoPath: string,
  currentVersion: string
): Promise<string> {
  const repo = new Repo(repoPath);

  const commits = getCommits(repoPath);
  const recommendedBump = await conventionalRecommendedBump(
    { preset: "angular" },
    { path: repoPath },
    { whatBump: commits }
  );
  const releaseType = recommendedBump.releaseType || "patch";
  const nextVersion = semver.inc(currentVersion, releaseType) || currentVersion;
  return nextVersion;
}
