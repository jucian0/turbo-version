#!/usr/bin/node

import { Command } from "commander";
//@ts-ignore
import packageJson from "../package.json";
import { byPackageFlux } from "./ByPackageFlux";
import { generateVersion } from "./GenerateVersion";
import { getLastVersion } from "./GetLastVersion";
import { createGitTag, gitAdd, gitCommit } from "./GitCommands";
import { setup } from "./Setup";
import { syncedFlux } from "./SyncedFlux";
import { updatePackageVersion } from "./UpdateVersion";

const program = new Command();

program
  .name("Turbo Semver")
  .description("Semver Turborepo")
  .version(packageJson.version);

program
  .command("version")
  .description(
    "Version the application by default, following the semver.config.json specifications"
  )
  .action(async () => {
    const config = await setup();

    if (config.synced) {
      return syncedFlux(config);
    }
    return byPackageFlux(config);
  });

program.parse();
