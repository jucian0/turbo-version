import { readJsonFile } from "./FileSystem";
import { Config, PkgJson } from "./Types";

export function getDependents(packages: string[], pkgName: string) {
  try {
    let dependents = [];
    for (const pkg of packages) {
      const json = readJsonFile<PkgJson>(`${pkg}/package.json`);

      const allDependencies = Object.keys({
        ...json.dependencies,
        ...json.devDependencies,
      });

      const dependency = allDependencies.find((dep) => dep === pkgName);
      if (dependency) {
        dependents.push(json.name);
      }
    }

    return dependents;
  } catch (err) {
    return [];
  }
}

export function filterPackages(pkgs: string[], folders: string[]) {
  return pkgs
    .filter((pkg) => {
      return folders.find((path) => path.includes(pkg));
    })
    .map((pkg) => ({
      package: readJsonFile<PkgJson>(`${pkg}/package.json`),
      path: pkg,
    }));
}
