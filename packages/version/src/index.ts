#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import figlet from "figlet";
import packageJson from "../package.json";
import { initCommand } from "./init-command";
import { bumpCommand } from "./bump-command";
import { helpCommand } from "./help-command";

const name = "Turboversion";

function showBanner() {
  console.log(
    chalk.hex("#FF1F57")(figlet.textSync(name)),
    chalk.hex("#0096FF")(
      `\n https://turboversion.juciano.com                     `
    ),
    chalk.hex("#0096FF")(`v${packageJson.version}\n`)
  );
}

async function main() {
  const program = new Command();

  program
    .name(name.toLowerCase())
    .description(
      "The smart, automated versioning tool for monorepos and single-package projects"
    )
    .version(packageJson.version)
    .hook("preAction", showBanner)
    .addCommand(initCommand())
    .addCommand(bumpCommand())
    .addCommand(helpCommand())
    .action(() => {
      showBanner();
      program.help(); // Show help if no command provided
    });

  await program.parseAsync();
}

main().catch((err) => {
  console.error(chalk.red("Error:"), err);
  process.exit(1);
});
