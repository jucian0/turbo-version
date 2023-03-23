import { summarizePackages } from "@turbo-version/dependents";
import { log } from "@turbo-version/log";
import { setup } from "@turbo-version/setup";
import { exit } from "process";
import { githubSetup } from "./github-setup";
import { npmSetup } from "./npm-setup";
import { publish } from "./publish";

export async function release() {
  try {
    await npmSetup();
    if (process.env.GITHUB_ACTIONS === "true") {
      await githubSetup();
    }
    const config = await setup();
    const packages = await summarizePackages(config);

    for (const pkg of packages) {
      await publish(pkg.relativeDir);
      log(["publish", "Successfully published", pkg.packageJson.name]);
    }
  } catch (err: any) {
    log(["error", "err.message", "Release"]);
    exit(1);
  }
}
