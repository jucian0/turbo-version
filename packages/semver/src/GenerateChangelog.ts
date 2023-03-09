import conventionalChangelog from "conventional-changelog";
import * as fs from "fs";

import { Config } from "./Types";
import { log } from "./Log";
import { resolvePkgPath } from "./Utils";

type ChangeLog = {
  tagPrefix: string;
  preset: string;
  pkgPath: string;
  nextVersion: string;
  pkgName: string;
};

export async function generateChangelog({
  tagPrefix,
  preset,
  pkgPath,
  nextVersion,
  pkgName,
}: ChangeLog) {
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
        preset,
        tagPrefix,
        releaseCount: 0,
        //lernaPackage: pkgName,
        // pkg: {
        //   path: pkgPath,
        // },
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
          pkgName: pkgName,
        });
        resolve(true);
      })
      .on("error", (err) => {
        log({
          step: "failure",
          message: `Error generating changelog`,
          pkgName: pkgName,
        });
        reject();
      });
  });
}
