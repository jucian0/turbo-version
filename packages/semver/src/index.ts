#!/usr/bin/node

import { Command } from "commander";
//@ts-ignore
import packageJson from "../package.json";
import { generateVersion } from "./GenerateVersion";
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

    const nextVersion = generateVersion();
    setup()
      .then((data) => {
        data.workspace.forEach((pkgPath) => {
          updatePackageVersion(pkgPath, "0.0.7")
            .then((resp) => console.log("resp", resp))
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => {
        console.error(err);
      });
  });

program.parse();
