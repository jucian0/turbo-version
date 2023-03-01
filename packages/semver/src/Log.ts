import chalk from "chalk";

type Step =
  | "nothing_changed"
  | "failure"
  | "warning"
  | "calculate_version_success"
  | "package_json_success"
  | "changelog_success"
  | "tag_success"
  | "post_target_success"
  | "push_success"
  | "commit_success";

const iconMap = new Map<Step, string>([
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

export function log<T>({
  step,
  message,
  projectName,
}: {
  step: Step;
  message: string;
  projectName: string;
}) {
  return () => _logStep({ step, message, projectName });
}

export function _logStep({
  step,
  message,
  projectName,
}: {
  step: Step;
  message: string;
  projectName: string;
  level?: string;
}): void {
  const msg = `${chalk.bold(`[${projectName}]`)} ${iconMap.get(
    step
  )} ${message}`;
  return console.log(msg);
}
