import { createTemplateString } from "./TemplateString";

type TagFormat = {
  tagPrefix?: string;
  name?: string;
  synced: boolean;
};

export function formatTagPrefix({
  tagPrefix,
  name,
  synced,
}: TagFormat): string {
  if (tagPrefix != null) {
    return createTemplateString(tagPrefix, {
      target: name,
      pkgName: name,
    });
  }

  if (synced) {
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
