import * as fs from "node:fs";
import { resolvePkgPath } from "@turboversion/fs";
import conventionalChangelog from "conventional-changelog";

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
        resolve(`Success changelog generated ${name}`);
      })
      .on("error", (err) => {
        reject(new Error(`Error generating changelog ${name}`));
      });
  });
}
