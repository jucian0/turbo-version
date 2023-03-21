import chalk from "chalk";

export type LogStep =
  | "list"
  | "error"
  | "warning"
  | "warning"
  | "success"
  | "new"
  | "box"
  | "paper"
  | "publish"
  | "tag"
  | "release";

export type LogProps = [LogStep, string, string];

const iconMap: Map<LogStep, string> = new Map([
  ["list", "📜"],
  ["error", "❌"],
  ["warning", "🟠"],
  ["success", "🟢"],
  ["new", "🆕"],
  ["box", "📦"],
  ["paper", "📝"],
  ["publish", "🎉"],
  ["tag", "🔖"],
  ["release", "🚀"],
]);

export function log([step, message, pkgName]: LogProps) {
  const icon = iconMap.get(step)?.toString() ?? "";
  const boldPkgName = chalk.bold(`[${pkgName}]`);
  const msg = `${boldPkgName} ${icon} ${message}`;

  console.log(msg);
}
