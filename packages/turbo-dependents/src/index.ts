import { getPackagesSync, Package as PKG } from "@manypkg/get-packages";
import { readJsonFile } from "@turbo-version/fs";
import { getFoldersWithCommits } from "@turbo-version/git";
import { Config, PkgJson } from "@turbo-version/setup";
import { cwd } from "process";

type Package = PKG & { type?: string };

function getDependents(
  packages: Package[],
  pkgName: string,
  type: any
): Package[] {
  try {
    const dependents = packages.reduce((acc, ac) => {
      const allDependencies = Object.keys({
        ...ac.packageJson.dependencies,
        ...ac.packageJson.devDependencies,
      });

      const dependency = allDependencies.find((dep) => dep === pkgName);
      if (dependency) {
        acc.push({ ...ac, type });
      }
      return acc;
    }, [] as any[]);

    // for (const pkg of packages) {
    //   const json = readJsonFile<PkgJson>(`${pkg}/package.json`);

    //   const allDependencies = Object.keys({
    //     ...json.dependencies,
    //     ...json.devDependencies,
    //   });

    //   const dependency = allDependencies.find((dep) => dep === pkgName);
    //   if (dependency) {
    //     dependents.push({ package: json, path: pkg, type });
    //   }
    // }

    return dependents;
  } catch (err) {
    return [];
  }
}

function filterPackages(packages: Package[], folders: string[]) {
  return packages.filter((pkg) => {
    return folders.find((path) => path.includes(pkg.relativeDir));
  });
}

export async function summarizePackages(config: Config): Promise<Package[]> {
  try {
    const folders = await getFoldersWithCommits();
    const monoRepo = getPackagesSync(cwd());
    const filteredPackages = filterPackages(monoRepo.packages, folders);

    const reducedPackages = filteredPackages.reduce((packages, pkg) => {
      const dependents = getDependents(
        monoRepo.packages,
        pkg.packageJson.name,
        config.updateInternalDependencies
      );

      const filtered = dependents.filter((d) =>
        packages.every((p) => p.relativeDir !== d.relativeDir)
      );

      return [...packages, ...filtered];
    }, filteredPackages);

    return reducedPackages;
  } catch (err) {
    return err as any;
  }
}
