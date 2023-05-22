export function createTemplateString(
  template: string,
  context: Record<string, any>
): string {
  return Object.keys(context).reduce((accumulator, contextParamKey) => {
    const interpolationRegex = new RegExp(`\\$\\{${contextParamKey}}`, "g");
    return accumulator.replace(
      interpolationRegex,
      context[contextParamKey].toString()
    );
  }, template);
}

export function formatCommitMessage({
  commitMessage,
  version,
  name,
}: {
  version: string;
  commitMessage?: string;
  name?: string;
}): string {
  return createTemplateString(commitMessage ?? "", {
    name: name ?? "",
    version,
  });
}
