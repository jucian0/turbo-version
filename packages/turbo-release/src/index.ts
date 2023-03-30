#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import { Command } from "commander";
//@ts-ignore
import packageJson from "../package.json";
import { release } from "./setup";
import { exit } from "process";

const name = "Turbo Release";

const program = new Command();

program.name("Turbo Version").description("").version(packageJson.version);

program
  .option("-t, --target <project>", "projects you want to release")
  .option("-s, --skip <project>", "projects you want to skip")

  .action(async (options) => {
    console.log(
      chalk.hex("#FF1F57")(figlet.textSync(name)),
      chalk.hex("#0096FF")(`v${packageJson.version}`)
    );
    try {
      await release(options);
    } catch (err: any) {
      console.error(chalk.red(`ERROR: ${err}`));
      exit(1);
    }
  });

program.parse();
