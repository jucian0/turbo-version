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
  .name("Version")
  .description("Semver Turborepo")
  .version(packageJson.version);

program
  .command("version")
  .description(
    "Version the application by default, following the semver.config.json specifications"
  )
  .action(async () => {
    const config = await setup();

    const currentVersion = await getLastVersion(config.tagPrefix);
    const nextVersion = await generateVersion(currentVersion, config.preset);

    try {
      config.workspace.forEach((pkgPath) => {
        updatePackageVersion(pkgPath, nextVersion)
          .then((resp) => console.log("resp", resp))
          .catch((err) => console.log(err));
      });
      await gitAdd(config.workspace);
      await gitCommit({
        message: `New version generated ${nextVersion}`,
      });
      await createGitTag({
        tag: nextVersion,
      });
    } catch (err) {}
  });

program.parse();
