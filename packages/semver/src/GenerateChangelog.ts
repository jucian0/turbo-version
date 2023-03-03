import conventionalChangelog from "conventional-changelog";
import { cwd } from "process";
import { getCommits } from "./GitCommands";
import * as fs from "fs";
import { Preset } from "../semver.schema";
import { Config } from "./Types";

export async function generateChangelog(
  config: Config,
  pkgPath: string,
  nextVersion: string
) {
  const context = { version: nextVersion };

  const outputStream = fs.createWriteStream(`${pkgPath}/CHANGELOG.md`, {
    flags: "w+",
  });

  conventionalChangelog(
    {
      preset: config.preset,
      tagPrefix: config.tagPrefix,
      config: {
        writerOpts: {
          headerPartial: "#changelog",
        },
      },
    },
    context,
    {
      merges: null,
      path: `${pkgPath}/package.json`,
    } as conventionalChangelog.Options
  )
    .pipe(outputStream)
    .on("close", () => {
      console.log("Success");
    })
    .on("error", (err) => {
      console.log(err);
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
