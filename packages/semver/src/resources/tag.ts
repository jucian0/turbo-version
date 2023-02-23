import { Repo } from "git-repository";
import { determineNextVersion, getChangelog, saveChangelog } from "./version";

async function generateTag(packagePath: string) {
  const repo = new Repo(packagePath);
  try {
    // Get the current version from the package.json
    const pkg = await repo.getFileJson("package.json");
    const currentVersion = pkg.version;

    // Determine the next version based on the commits
    const nextVersion = await determineNextVersion(packagePath, currentVersion);

    // Generate the changelog based on the commits
    const changelog = await getChangelog(
      packagePath,
      currentVersion,
      nextVersion
    );

    // Save the changelog to a file
    await saveChangelog(packagePath, changelog);

    // Update the package.json version and write it to disk
    pkg.version = nextVersion;
    await repo.writeFile("package.json", JSON.stringify(pkg, null, 2));

    // Create a new commit with the updated package.json and changelog files
    await repo.exec(`git add package.json ${changelog}`);
    await repo.exec(`git commit -m "chore(release): ${nextVersion}"`);

    // Create a new tag for the release
    await repo.exec(`git tag -a ${nextVersion} -m "${nextVersion}"`);

    console.log(`Successfully generated tag ${nextVersion}`);
  } catch (error) {
    console.error(`Failed to generate tag: ${error}`);
  }
}
