#!/usr/bin/env node

import { Command, Option } from "commander";
//@ts-ignore
import packageJson from "../package.json";
import { asyncFlux } from "./AsyncFlux";
import { setup } from "./Setup";
import { syncedFlux } from "./SyncedFlux";

const program = new Command();

program
  .name("Turbo Semver")
  .description("Semver Turborepo")
  .version(packageJson.version);

program.option("-s, --synced");

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
    ])
  )
  .description(
    "Version the application by default, following the semver.config.json specifications"
  )
  .action(async (options) => {
    const config = await setup();
    const isSynced = options.synced ?? config.synced;

    if (isSynced) {
      if (options.bump) {
        return syncedFlux(config, options.bump);
      }
      return syncedFlux(config);
    }

    if (options.bump) {
      return asyncFlux(config, options.bump);
    }

    return asyncFlux(config);
  });

program.parse();
