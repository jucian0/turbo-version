#!/urs/bin/env node

import { Command } from "commander";
//@ts-ignore
import packageJson from "../package.json";

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
    console.log("Semver");
  });

program.parse();
