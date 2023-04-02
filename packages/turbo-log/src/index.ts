import chalk from "chalk";

export type LogStep =
  | "list"
  | "failed"
  //| "warning"
  | "warning"
  | "no_changes"
  | "new"
  //| "box"
  | "paper"
  | "publish"
  | "tag"
  | "release"
  | "error"
  | "skip";

export type LogProps = [LogStep, string, string];

const iconMap: Map<LogStep, string> = new Map([
  ["list", "📜"],
  ["failed", "❌"],
  //["warning", "🟠"],
  ["no_changes", "🟢"],
  ["new", "🆕"],
  //["box", "📦"],
  ["paper", "📝"],
  ["publish", "🎉"],
  ["tag", "🔖"],
  ["release", "🚀"],
  ["error", "❌"],
  ["skip", "⏩"],
]);

export function log([step, message, packageName]: LogProps) {
  const icon = iconMap.get(step)?.toString() ?? "";
  const boldPkgName = chalk.bold(`[${packageName}]`);
  const msg = `${boldPkgName} ${icon} ${message}`;

  if (step === "error") {
    return console.log(chalk.red(msg));
  }
  return console.log(msg);
}
