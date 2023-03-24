#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import { Command } from "commander";
//@ts-ignore
import packageJson from "../package.json";
import { release } from "./setup";

const name = "Turbo Release";

const program = new Command();

program.name("Turbo Version").description("").version(packageJson.version);

program
  .option("-t, --target <project>", "projects you want to release")

  .action((options) => {
    console.log(
      chalk.hex("#FF1F57")(figlet.textSync(name)),
      chalk.hex("#0096FF")(`v${packageJson.version}`)
    );

    release(options.target);
  });

program.parse();
