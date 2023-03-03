import conventionalChangelog from "conventional-changelog";
import { cwd } from "process";
import { getCommits } from "./GitCommands";
import * as fs from "fs";

import { Config } from "./Types";
import { WriteChangelogConfig } from "../semver.schema";

export async function generateChangelog(
  config: Config,
  pkgPath: string,
  nextVersion: string
) {
  const context = { version: nextVersion };

  let changelog = "";

  conventionalChangelog(
    {
      preset: config.preset,
      tagPrefix: config.tagPrefix,
    },
    context,
    {
      merges: null,
      path: pkgPath,
    } as conventionalChangelog.Options
  )
    .on("error", function (err) {
      //  reject(err);
    })

    .on("data", function (buffer: ArrayBuffer) {
      changelog += buffer.toString();
    })

    .on("end", function () {
      fs.writeFileSync(
        `${pkgPath}/CHANGELOG.md`,
        `# Changelog` +
          "\n" +
          (changelog + buildExistingContent(`${pkgPath}/CHANGELOG.md`)).replace(
            /\n+$/,
            "\n"
          ),
        "utf8"
      );
    });
}

const START_OF_LAST_RELEASE_PATTERN =
  /(^#+ \[?[0-9]+\.[0-9]+\.[0-9]+|<a name=)/m;

function buildExistingContent(changelogPath: string) {
  const existingContent = fs.readFileSync(changelogPath, "utf-8");
  const existingContentStart = existingContent.search(
    START_OF_LAST_RELEASE_PATTERN
  );
  // find the position of the last release and remove header:
  if (existingContentStart !== -1) {
    return existingContent.substring(existingContentStart);
  }

  return existingContent;
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
