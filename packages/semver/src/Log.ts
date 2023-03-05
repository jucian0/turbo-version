import chalk from "chalk";
import { LogProps, LogStep } from "./Types";

const iconMap = new Map<LogStep, string>([
  ["failure", "❌"],
  ["warning", "🟠"],
  ["nothing_changed", "🟢"],
  ["calculate_version_success", "🆕"],
  ["changelog_success", "📜"],
  ["commit_success", "📦"],
  ["package_json_success", "📝"],
  ["post_target_success", "🎉"],
  ["tag_success", "🔖"],
  ["push_success", "🚀"],
]);

export function log<T>({ step, message, pkgName }: LogProps) {
  const msg = `${chalk.bold(`[${pkgName}]`)} ${iconMap.get(step)} ${message}`;

  console.log(msg);
}
