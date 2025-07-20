#!/usr/bin/env node

import { exit } from "node:process";
import chalk from "chalk";
import { Command, Option } from "commander";
import { syncedFlux } from "./sync-mode";
import { singleFlux } from "./single-mode";
import { asyncFlux } from "./async-mode";
import { setup } from "../setup";

type BumpOption =
  | "patch"
  | "minor"
  | "major"
  | "premajor"
  | "preminor"
  | "prepatch"
  | "prerelease";
type CommandOptions = {
  target?: string;
  bump?: BumpOption;
};

export function bumpCommand(): Command {
  const program = new Command();

  return program
    .command("bump")
    .description(
      "Version the application following the version.config.json specifications\n" +
        chalk.gray("Default behavior depends on your configuration")
    )
    .option(
      "-t, --target <project>",
      "Specific project to version (ignored in synced mode)"
    )
    .addOption(
      new Option("-b, --bump <version>", "Specify version bump type")
        .choices([
          "patch",
          "minor",
          "major",
          "premajor",
          "preminor",
          "prepatch",
          "prerelease",
        ])
        .makeOptionMandatory(false)
    )
    .addHelpText(
      "after",
      `\nExamples:
  ${chalk.cyan("$ turbo bump")}
  ${chalk.cyan("$ turbo bump -b minor")}
  ${chalk.cyan("$ turbo bump -t frontend")}`
    )
    .action(async (options: CommandOptions) => {
      try {
        const config = await setup();

        if (
          config.versionStrategy === "branchPattern" &&
          !config.branchPattern
        ) {
          config.branchPattern = ["major", "minor", "patch"];
        }

        if (config.synced && options.target) {
          console.log(
            chalk.yellow.bold("⚠ Warning:") +
              chalk.yellow(
                " Target option ignored in synced mode. All projects will be versioned together."
              )
          );
        }

        if (config.synced) {
          await syncedFlux(config, options.bump);
        } else if (options.bump && options.target) {
          await singleFlux(config, options);
        } else {
          await asyncFlux(config, options.bump);
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(
          chalk.red.bold("✖ Error:") + " " + chalk.red(errorMessage)
        );
        exit(1);
      }
    });
}
