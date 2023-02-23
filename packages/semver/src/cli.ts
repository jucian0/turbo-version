#!/usr/bin/env node

import program from "commander";
import { generateChangelog } from "./generateChangelog";

program
  .option(
    "-p, --package <package>",
    "The name of the package to generate a changelog for"
  )
  .option("-v, --version <version>", "The version to generate a changelog for")
  .option(
    "-o, --output <output>",
    "The name of the output file to save the changelog to (default: CHANGELOG.md)"
  )
  .parse(process.argv);

const { package: packageName, version, output = "CHANGELOG.md" } = program;

generateChangelog(packageName, version, output)
  .then(() => console.log(`Changelog saved to ${output}`))
  .catch((err) => console.error(err));
