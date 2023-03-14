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
