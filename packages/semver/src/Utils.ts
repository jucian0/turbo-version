import { cwd } from "process";

export function extractPgkName(pkgPath: string) {
  return pkgPath.split("/")[1];
}

export function resolvePkgPath(relativePath: string) {
  return `${cwd()}/${relativePath}`;
}
