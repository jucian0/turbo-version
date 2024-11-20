#!/usr/bin/env node

import { exit } from "node:process";
import { setup } from "@turbo-version/setup";
import chalk from "chalk";
import { Command, Option } from "commander";
import figlet from "figlet";
//@ts-ignore
import packageJson from "../package.json";
import { asyncFlux } from "./AsyncFlux";
import { singleFlux } from "./SingleFlux";
import { syncedFlux } from "./SyncedFlux";

const name = "Turbo Version";

const program = new Command();

program.name("Turbo Version").description("").version(packageJson.version);

program.option("-t, --target <project>", "project you want to bump version");

program
   .addOption(
      new Option("-b, --bump <version>", "next version").choices([
         "patch",
         "minor",
         "major",
         "premajor",
         "preminor",
         "prepatch",
         "prerelease",
      ]),
   )
   .description(
      "Version the application by default, following the version.config.json specifications",
   )
   .action(async (options): Promise<any> => {
      console.log(
         chalk.hex("#FF1F57")(figlet.textSync(name)),
         chalk.hex("#0096FF")(`v${packageJson.version}`),
      );
      try {
         const config = await setup();
         if (config.versionStrategy === "branchPattern") {
            if (!config.branchPattern) {
               config.branchPattern = ["major", "minor", "patch"];
            }
         }
         if (config.synced) {
            if (options.target) {
               console.log(
                  chalk.yellow(
                     "Looks like you are using `synced` mode with `-target | --t`. Since `synced` mode precedes `-target | --t`, we are going to ignore it!",
                  ),
               );
            }
            return syncedFlux(config, options.bump);
         }

         if (options.bump && options.target) {
            return singleFlux(config, options);
         }
         return asyncFlux(config, options.bump);
      } catch (err: any) {
         console.error(chalk.red(`ERROR: ${err}`));
         exit(1);
      }
   });

program.parse();

/**
 * Async mode
 * pnpm semver -b minor -t ui -> bump a specific package version, defined by args -b, and -t.
 * pnpm semver -b minor -> bump all packages versions, defined by arg -b.
 * pnpm semver -> bump all packages versions affected by commits since last release.
 */

/**
 * Synced mode
 * pnpm semver -> bump all packages versions for all packages in synced mode.
 * pnpm semver -> bump all packages versions affected by commits since last release.
 */
