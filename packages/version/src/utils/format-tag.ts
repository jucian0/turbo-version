import { createTemplateString } from "./template-string";

type TagFormat = {
  tagPrefix?: string;
  name?: string;
  sync: boolean;
};

export function formatTagPrefix({ tagPrefix, name, sync }: TagFormat): string {
  if (tagPrefix != null) {
    return createTemplateString(tagPrefix, {
      target: name,
      packageName: name,
    });
  }

  if (sync) {
    return "v";
  }

  return `${name}-`;
}

export function formatTag({
  tagPrefix,
  version,
}: {
  tagPrefix: string;
  version: string;
}): string {
  return `${tagPrefix}${version}`;
}
