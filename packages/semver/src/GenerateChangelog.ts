import conventionalChangelog from "conventional-changelog";
import { cwd } from "process";
import { getCommits } from "./GitCommands";
import * as fs from "fs";

import { Config } from "./Types";
import { log } from "./Log";

export async function generateChangelog(
  config: Config,
  pkgPath: string,
  nextVersion: string
) {
  const context = { version: nextVersion };

  // fs.writeFileSync(`${pkgPath}/CHANGELOG.md`, `# Changelog \n \n`, "utf-8");

  const outputStream = fs.createWriteStream(`${pkgPath}/CHANGELOG.md`, {
    flags: "w+",
  });

  conventionalChangelog(
    {
      preset: config.preset,
      tagPrefix: config.tagPrefix,
      releaseCount: 0,
    },
    context,
    {
      merges: null,
      path: pkgPath,
    } as conventionalChangelog.Options
  )
    .pipe(outputStream)
    .on("close", () => {
      log({
        step: "changelog_success",
        message: `Success changelog generated`,
        projectName: pkgPath.split("/")[1],
      });
    })
    .on("error", (err) => {
      log({
        step: "failure",
        message: `Error generating changelog`,
        projectName: pkgPath.split("/")[1],
      });
    });
}

export function generateAllChangelogs(
  config: Config,
  nextVersion: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    config.packages.forEach(async (pkgPath) => {
      try {
        await generateChangelog(config, pkgPath, nextVersion);
      } catch (err) {
        reject(err);
      }
      resolve(true);
    });
  });
}
