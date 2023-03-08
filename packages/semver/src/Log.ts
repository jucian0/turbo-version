import chalk from "chalk";

export type LogStep =
  | "nothing_changed"
  | "failure"
  | "warning"
  | "calculate_version_success"
  | "package_json_success"
  | "changelog_success"
  | "tag_success"
  | "post_target_success"
  | "push_success"
  | "commit_success"
  | "calculate_version_failure";

export type LogProps = {
  step: LogStep;
  message: string;
  pkgName: string;
};

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
  ["calculate_version_failure", "❌"],
]);

export function log<T>({ step, message, pkgName }: LogProps) {
  const msg = `${chalk.bold(`[${pkgName}]`)} ${iconMap.get(step)} ${message}`;

  console.log(msg);
}
