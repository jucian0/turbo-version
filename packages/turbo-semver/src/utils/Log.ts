import chalk from "chalk";

export type LogStep =
  | "affected_packages"
  | "nothing_changed"
  | "failure"
  | "warning"
  | "calculate_version_success"
  | "package_json_success"
  | "changelog_success"
  | "tag_success"
  | "publish_success"
  | "push_success"
  | "commit_success";

export type LogProps = {
  step: LogStep;
  message: string;
  pkgName: string;
};

const iconMap: Map<LogStep, string> = new Map([
  ["affected_packages", "📜"],
  ["failure", "❌"],
  ["warning", "🟠"],
  ["nothing_changed", "🟢"],
  ["calculate_version_success", "🆕"],
  ["changelog_success", "📜"],
  ["commit_success", "📦"],
  ["package_json_success", "📝"],
  ["publish_success", "🎉"],
  ["tag_success", "🔖"],
  ["push_success", "🚀"],
]);

export function log({ step, message, pkgName }: LogProps) {
  const icon = iconMap.get(step)?.toString() ?? "";
  const boldPkgName = chalk.bold(`[${pkgName}]`);
  const msg = `${boldPkgName} ${icon} ${message}`;

  console.log(msg);
}
