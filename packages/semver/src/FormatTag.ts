import { createTemplateString } from "./TemplateString";

type TagFormat = {
  tagPrefix: string | null | undefined;
  pkgName: string;
  synced: boolean;
};

export function formatTagPrefix({
  tagPrefix,
  pkgName,
  synced,
}: TagFormat): string {
  if (tagPrefix != null) {
    return createTemplateString(tagPrefix, {
      target: pkgName,
      pkgName: pkgName,
    });
  }

  if (synced) {
    return "v";
  }

  return `${pkgName}-`;
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
