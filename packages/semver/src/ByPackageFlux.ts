import conventionalCommitsParser from "conventional-commits-parser";
import { cwd } from "process";
import { getCommits, gitAffectedFiles } from "./GitCommands";
import { Config } from "./Types";

export async function byPackageFlux(config: Config, type?: string) {
  const filteredPkgs = await gitAffectedFiles();

  const commits = await getCommits(cwd() + "/packages/acme-core");

  /**
   * validate if there are any commits in the package folder
   * if true - generate a recommended version
   */

  /**
   * validate if there are commits in the root of the monorepo
   * if true -> generate the recommended bump, and validate if the recommended bum is bigger than packages recommendation
   * if true -> apply for the root recommendations for all packages that has a small bump recommendation
   */

  /**
   * validate if a update action affects other packages by internal dependencies
   * if true -> validate if the affected packages are already going to be updated too by its internal commits
   * if true -> just apply the recommended update
   * if false - > apply a patch update.
   */

  console.log(commits, `<<<<<<<<<<<<<<<<<`);
}
