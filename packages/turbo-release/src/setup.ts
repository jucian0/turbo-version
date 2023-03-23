import { log } from "@turbo-version/log";
import { cwd, exit } from "process";
import { githubSetup } from "./github-setup";
import { npmSetup } from "./npm-setup";
import { publish } from "./publish";
import { getPackagesSync } from "@manypkg/get-packages";

export async function release(target?: string) {
  try {
    const targets = target?.split(",").map((t) => t.trim());
    await npmSetup();
    if (process.env.GITHUB_ACTIONS === "true") {
      await githubSetup();
    }
    const { packages } = getPackagesSync(cwd());

    for (const pkg of packages) {
      await publish(pkg.relativeDir);
      log(["publish", "Successfully published", pkg.packageJson.name]);
    }
  } catch (err: any) {
    log(["error", err.message, "Release"]);
    exit(1);
  }
}
