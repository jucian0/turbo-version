import conventionalChangelog from "conventional-changelog";
import * as fs from "fs";

import { Config } from "./Types";
import { log } from "./Log";
import { extractPgkName, resolvePkgPath } from "./Utils";

export async function generateChangelog(
  config: Config,
  pkgPath: string,
  nextVersion: string
) {
  const context = { version: nextVersion };

  return new Promise((resolve, reject) => {
    const outputStream = fs.createWriteStream(
      resolvePkgPath(`${pkgPath}/CHANGELOG.md`),
      {
        flags: "w+",
      }
    );

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
          pkgName: extractPgkName(pkgPath),
        });
        resolve(true);
      })
      .on("error", (err) => {
        log({
          step: "failure",
          message: `Error generating changelog`,
          pkgName: extractPgkName(pkgPath),
        });
        reject();
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
      } finally {
        resolve(true);
      }
    });
  });
}
