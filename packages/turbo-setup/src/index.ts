import * as fs from "node:fs";
import { cwd } from "node:process";

export type PkgJson = {
   name: string;
   version: string;
   dependencies?: Record<string, string>;
   devDependencies?: Record<string, string>;
   path?: string;
};

export type Config = {
   tagPrefix: string;
   preset: string;
   baseBranch: string;
   synced: boolean;
   packages: string[];
   updateInternalDependencies:
   | "major"
   | "minor"
   | "patch"
   | "no-internal-update";
   strategy: "first-release" | "next-release" | "last-release";
   skip?: string[];
   commitMessage?: string;
   versionStrategy?: "branchPattern" | "commitMessage";
   branchPattern: string[];
   prereleaseIdentifier?: string;
   skipHooks?: boolean;
};

export function setup(): Promise<Config> {
   const localProcess = cwd();
   return new Promise((resolve, reject) => {
      fs.readFile(
         `${localProcess}/version.config.json`,
         "utf-8",
         (err, data) => {
            if (err) {
               reject(
                  new Error("Could not locate the `version.config.json file"),
               );
            }

            try {
               const config: Config = JSON.parse(data);
               resolve(config);
            } catch (err) {
               reject(
                  new Error("Could not locate the `version.config.json file`"),
               );
            }
         },
      );
   });
}
