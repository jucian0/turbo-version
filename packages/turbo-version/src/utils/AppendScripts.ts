import { Package as P, Tool } from "@manypkg/get-packages";
import { exec } from "child_process";
import { promisify } from "util";

type Package = P & {
  packageJson: P["packageJson"] & { scripts: Record<string, string> };
};

function extractScripts(scripts: string[], pkg: Package) {
  return scripts.filter((s) =>
    Object.keys(pkg.packageJson.scripts).some((key) => key === s)
  );
}

export async function appendScripts(
  packages: Package[],
  rootDir: string,
  scripts: string[],
  tool: Tool
) {
  try {
    if (!Array.isArray(scripts)) {
      throw new Error("`appendScripts` should be an array.");
    }
    for (const pkg of packages) {
      const pkgScripts = extractScripts(scripts, pkg);

      await promisify(process.chdir)(pkg.relativeDir);
      for (const script of pkgScripts) {
        console.log(`>>>>>>>`, pkgScripts);
        const command = `${tool.type} ${script}`;
        await promisify(exec)(command);
      }
      await promisify(process.chdir)(rootDir);
    }
  } catch (err: any) {
    throw new Error(err.message);
    //  console.log(err);
  }
}
