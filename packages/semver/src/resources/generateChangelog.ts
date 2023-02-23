import { Repo } from "git-repository";
import conventionalRecommendedBump from "conventional-recommended-bump";
import conventionalChangelog from "conventional-changelog";
import semver from "semver";
import fs from "fs/promises";
import { determineNextVersion } from "./git";

interface Package {
  name: string;
  path: string;
  version: string;
}

interface VersionInfo {
  version: string;
  changelog: string;
}

async function getCommits(repo: Repo, packageName: string): Promise<string[]> {
  const commits = await repo.exec(
    `git log --format="%s" --grep="^chore(${packageName}): "`
  );
  return commits.split("\n").filter(Boolean);
}

export async function generateChangelog(
  repoPath: string,
  packageName: string
): Promise<string> {
  const repo = new Repo(repoPath);
  const packageCommits = await getCommits(repo, packageName);
  const fromCommit = packageCommits[packageCommits.length - 1];
  const toCommit = packageCommits[0];

  const options = {
    preset: "angular",
    releaseCount: 1,
    outputUnreleased: true,
    pkg: { path: `packages/${packageName}/package.json` },
    from: fromCommit,
    to: toCommit,
  };

  return new Promise((resolve, reject) => {
    conventionalChangelog(options, (error, changelog) => {
      if (error) {
        reject(error);
      } else {
        resolve(changelog);
      }
    });
  });
}

async function writeVersionInfoToFile(
  packageName: string,
  versionInfo: VersionInfo
): Promise<void> {
  const fileName = `${packageName}-version-info.json`;
  const jsonString = JSON.stringify(versionInfo);
  await fs.writeFile(fileName, jsonString);
}

export async function updatePackageVersion(
  packagePath: string,
  nextVersion: string
): Promise<void> {
  const packageJsonPath = `${packagePath}/package.json`;
  const packageJsonContent = await fs.readFile(packageJsonPath, "utf-8");
  const packageJson = JSON.parse(packageJsonContent);
  packageJson.version = nextVersion;
  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

export async function generateVersionInfo(
  repoPath: string,
  packageInfo: Package
): Promise<VersionInfo> {
  const nextVersion = await determineNextVersion(
    packageInfo.path,
    packageInfo.version
  );
  const changelog = await generateChangelog(repoPath, packageInfo.name);
  await writeVersionInfoToFile(packageInfo.name, {
    version: nextVersion,
    changelog,
  });
  await updatePackageVersion(packageInfo.path, nextVersion);
  return { version: nextVersion, changelog };
}
