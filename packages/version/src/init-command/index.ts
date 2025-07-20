import inquirer from "inquirer";
import { writeFileSync } from "node:fs";
import { Command } from "commander";
import chalk from "chalk";

export function initCommand(): Command {
  const program = new Command();

  return program
    .command("init")
    .description("Initialize version configuration")
    .action(async () => {
      try {
        const answers = await inquirer.prompt([
          {
            type: "input",
            name: "tagPrefix",
            message: "Enter your Git tag prefix (e.g., project name):",
            validate: (input) => input.length > 0 || "Prefix is required",
            default: "v",
          },
          {
            type: "list",
            name: "versionStrategy",
            message: "Select versioning strategy:",
            choices: [
              {
                name: "Commit messages (conventional commits)",
                value: "commitMessage",
              },
              {
                name: "Branch name patterns",
                value: "branchPattern",
              },
            ],
            default: "commitMessage",
          },
          {
            type: "list",
            name: "preset",
            message: "Select commit message convention:",
            choices: ["angular", "conventional"],
            default: "angular",
            when: (answers) => answers.versionStrategy === "commitMessage",
          },
          {
            type: "checkbox",
            name: "branchPattern",
            message: "Select branch patterns:",
            choices: ["major", "minor", "patch"],
            default: ["major", "minor", "patch"],
            when: (answers) => answers.versionStrategy === "branchPattern",
          },
          {
            type: "input",
            name: "prereleaseIdentifier",
            message:
              "Enter prerelease identifier (optional, e.g., beta, alpha):",
          },
          {
            type: "input",
            name: "baseBranch",
            message: "Enter your base branch (e.g., main, master):",
            default: "main",
            validate: (input) => input.length > 0 || "Base branch is required",
          },
          {
            type: "list",
            name: "updateInternalDependencies",
            message: "How should internal dependencies be updated?",
            choices: [
              { name: "Major versions", value: "major" },
              { name: "Minor versions", value: "minor" },
              { name: "Patch versions", value: "patch" },
              { name: "Don't update", value: false },
            ],
            default: "patch",
          },
          {
            type: "confirm",
            name: "synced",
            message: "Use synced mode for all packages?",
            default: false,
          },
        ]);

        const config = {
          $schema: "http://json-schema.org/draft-07/schema#",
          ...answers,
          commitMessage: `chore(${answers.tagPrefix}): release version \${version} [skip-ci]`,
        };

        writeFileSync("version.config.json", JSON.stringify(config, null, 2));
        console.log(
          chalk.green("✔ Configuration created: version.config.json")
        );
      } catch (error) {
        console.error(chalk.red("✖ Error creating configuration:"), error);
        process.exit(1);
      }
    });
}
