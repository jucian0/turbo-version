import { readJsonFile } from "./FileSystem";
import { Config, PkgJson } from "./Types";

export async function defineInternalDependencies(
  config: Config,
  pkgName: string
) {
  try {
    let internalDependencies = [];
    for (const pkg of config.packages) {
      const json = await readJsonFile<PkgJson>(pkg);

      const allDependencies = Object.keys({
        ...json.dependencies,
        ...json.devDependencies,
      });

      const dependency = allDependencies.find((dep) => dep === pkgName);
      if (dependency) {
        internalDependencies.push(dependency);
      }
    }

    return internalDependencies;
  } catch (err) {
    return [];
  }
}

export function filterPackages(pkgs: string[], folders: string[]) {
  return pkgs.filter((pkg) => {
    return folders.find((path) => path.includes(pkg));
  });
}
