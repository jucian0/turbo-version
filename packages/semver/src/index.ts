#!/usr/bin/node

import { Command } from "commander";
//@ts-ignore
import packageJson from "../package.json";
import { generateVersion } from "./GenerateVersion";
import { getLastVersion } from "./GetLastVersion";
import { createGitTag, gitAdd, gitCommit } from "./GitCommands";
import { setup } from "./Setup";
import { updatePackageVersion } from "./UpdateVersion";

const program = new Command();

program
  .name("Turbo Semver")
  .description("Semver Turborepo")
  .version(packageJson.version);

program
  .command("version")
  .description(
    "Version the application by default, following the semver.config.json specifications"
  )
  .action(async () => {
    const config = await setup();

    /**
     * It's necessary to validate last version, and next version by project name
     */

    const currentVersion = await getLastVersion(config.tagPrefix);
    const nextVersion = await generateVersion(
      currentVersion,
      config.preset,
      config.tagPrefix
    );

    try {
      config.packages.forEach((pkgPath) => {
        updatePackageVersion(pkgPath, nextVersion)
          .then(async () => {
            await gitAdd([`${pkgPath}/package.json`]);
            await gitCommit({
              message: `New version generated ${config.tagPrefix}${nextVersion}`,
            });
            await createGitTag({
              tag: `${config.tagPrefix}${nextVersion}`,
              message: `New Version ${new Date().toISOString()}`,
              annotated: true,
            });
          })
          .catch((err) => err);
      });
    } catch (err) {
      console.error(err);
    }
  });

program.parse();
