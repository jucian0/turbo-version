#!/usr/bin/node

import { Command } from "commander";
//@ts-ignore
import packageJson from "../package.json";
import { updatePackageVersion } from "./UpdateVersion";

const program = new Command();

program
  .name("Version")
  .description("Semver Turborepo")
  .version(packageJson.version);

program
  .command("")
  .description(
    "Version the application by default, following the semver.config.json specifications"
  )
  .action(() => {
    updatePackageVersion("packages/mock", "0.0.7");
    console.log("Semver");
  });

program.parse();
