import { log } from "@turbo-version/log";
import { cwd, exit } from "process";
import { githubSetup } from "./github-setup";
import { npmSetup } from "./npm-setup";
import { publish } from "./publish";
import { getPackagesSync } from "@manypkg/get-packages";

export async function release(target?: string) {
  try {
    await npmSetup();
    if (process.env.GITHUB_ACTIONS === "true") {
      await githubSetup();
    }
    const { packages, tool } = getPackagesSync(cwd());

    const targets = target?.split(",").map((t) => t.trim());

    const pkgs = packages.filter((pkg) => {
      if (target) {
        return targets?.some((t) => t === pkg.packageJson.name);
      }
      return pkg;
    });

    for (const pkg of pkgs) {
      await publish(tool.type, pkg.relativeDir);
      log(["publish", "Successfully published", pkg.packageJson.name]);
    }
  } catch (err: any) {
    log(["error", err.message, "Release"]);
    exit(1);
  }
}
