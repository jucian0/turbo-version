import chalk from "chalk";
import figlet from "figlet";
import packageJson from "../../package.json";
import { Command } from "commander";

export function helpCommand() {
  const program = new Command();

  return program
    .command("help")
    .description("Show help information")
    .action(() => {
      console.log(
        chalk.hex("#FF1F57")(figlet.textSync("Turboversion")),
        chalk.hex("#0096FF")(`v${packageJson.version}\n`)
      );

      console.log(chalk.bold("USAGE"));
      console.log("  $ turbo <command> [options]\n");

      console.log(chalk.bold("COMMANDS"));
      console.log("  init       Initialize version configuration");
      console.log("  bump       Version your packages");
      console.log("  help       Show this help message\n");

      console.log(chalk.bold("EXAMPLES"));
      console.log(chalk.gray("  # Initialize configuration"));
      console.log("  $ turbo init\n");

      console.log(chalk.gray("  # Bump versions automatically"));
      console.log("  $ turbo bump\n");

      console.log(chalk.gray("  # Bump specific package to minor version"));
      console.log("  $ turbo bump -b minor -t ui\n");

      console.log(chalk.bold("LEARN MORE"));
      console.log(
        `  ${chalk.underline("https://github.com/turboversion/turboversion")}`
      );
    });
}
