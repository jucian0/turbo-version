import { resolvePkgPath } from "@turbo-version/fs";
import { log } from "@turbo-version/log";
import conventionalChangelog from "conventional-changelog";
import * as fs from "fs";

type ChangeLog = {
  tagPrefix: string;
  preset: string;
  path: string;
  version: string;
  name: string;
};

export async function generateChangelog({
  tagPrefix,
  preset,
  path,
  version,
  name,
}: ChangeLog) {
  const context = { version };

  return new Promise((resolve, reject) => {
    const outputStream = fs.createWriteStream(
      resolvePkgPath(`${path}/CHANGELOG.md`),
      {
        flags: "w+",
      }
    );

    conventionalChangelog(
      {
        preset,
        tagPrefix,
        releaseCount: 0,
      },
      context,
      {
        merges: null,
        path,
      } as conventionalChangelog.Options
    )
      .pipe(outputStream)
      .on("close", () => {
        log({
          step: "changelog_success",
          message: `Success changelog generated`,
          pkgName: name,
        });
        resolve(true);
      })
      .on("error", (err) => {
        log({
          step: "failure",
          message: `Error generating changelog`,
          pkgName: name,
        });
        reject();
      });
  });
}
