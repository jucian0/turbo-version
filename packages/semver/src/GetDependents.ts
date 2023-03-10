import { readJsonFile } from "./FileSystem";
import { getFoldersWithCommits } from "./GitCommands";
import { Config, PkgJson } from "./Types";

type Package = {
  path: string;
  package: PkgJson;
  type?: Config["updateInternalDependencies"];
};

function getDependents(
  packages: string[],
  pkgName: string,
  type: any
): Package[] {
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
        dependents.push({ package: json, path: pkg, type });
      }
    }

    return dependents;
  } catch (err) {
    return [];
  }
}

function filterPackages(pkgs: string[], folders: string[]): Package[] {
  return pkgs
    .filter((pkg) => {
      return folders.find((path) => path.includes(pkg));
    })
    .map((pkg) => ({
      package: readJsonFile<PkgJson>(`${pkg}/package.json`),
      path: pkg,
      type: undefined,
    }));
}

export function summarizePackages(config: Config) {
  const filteredPackages = filterPackages(
    config.packages,
    getFoldersWithCommits()
  );

  const dependentsPKgs = filteredPackages;

  filteredPackages.forEach((pkg) => {
    const dependents = getDependents(
      config.packages.filter((p) => p !== pkg.package.name),
      pkg.package.name,
      config.updateInternalDependencies
    ).filter((d) => dependentsPKgs.every((p) => p.path !== d.path));

    dependentsPKgs.concat(dependents);
  });

  return dependentsPKgs;
}
