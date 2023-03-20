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

export async function summarizePackages(config: Config): Promise<Package[]> {
  try {
    const folders = await getFoldersWithCommits();
    const filteredPackages = filterPackages(config.packages, folders);

    const packages = filteredPackages.reduce((packages, pkg) => {
      const dependents = getDependents(
        config.packages,
        pkg.package.name,
        config.updateInternalDependencies
      );

      const filtered = dependents.filter((d) =>
        packages.every((p) => p.path !== d.path)
      );

      return [...packages, ...filtered];
    }, filteredPackages);

    return packages;
  } catch (err) {
    return err as any;
  }
}
