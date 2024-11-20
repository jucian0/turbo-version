import { cwd, exit } from "node:process";
import { getPackagesSync } from "@manypkg/get-packages";
import { log } from "@turbo-version/log";
import chalk from "chalk";
import { isVersionPublished } from "./isVersionPublished";
import { npmSetup } from "./npm-setup";
import { publish } from "./publish";

type Options = {
   skip?: string;
   target?: string;
   client?: "npm" | "yarn" | "pnpm";
};

export async function release({ target, skip, client }: Options) {
   try {
      await npmSetup();

      const { packages, tool } = getPackagesSync(cwd());

      const targets = target?.split(",").map((t) => t.trim());
      const skips = skip?.split(",").map((t) => t.trim());

      const pkgs = packages.filter((pkg) => {
         if (target) {
            return targets?.some((t) => t === pkg.packageJson.name);
         }

         if (skip) {
            return skips?.every((t) => t !== pkg.packageJson.name);
         }
         return pkg;
      });

      console.log(
         chalk.cyan(
            `Working on ${pkgs
               .map((n) => chalk.hex("#FF1F57")(n.packageJson.name))
               .toString()} package(s).\n`,
         ),
      );

      for (const pkg of pkgs) {
         const isPublished = await isVersionPublished(
            pkg.packageJson.name,
            pkg.packageJson.version,
         );
         if (!isPublished) {
            await publish(client ?? tool.type ?? "npm", pkg.relativeDir);
            log([
               "publish",
               `Successfully published ${pkg.packageJson.version}`,
               pkg.packageJson.name,
            ]);
         } else {
            log([
               "no_changes",
               `Version already published ${pkg.packageJson.version}`,
               pkg.packageJson.name,
            ]);
         }
      }
   } catch (err: any) {
      log(["error", err, "Release"]);
      exit(1);
   }
}
