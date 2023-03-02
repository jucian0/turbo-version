import conventionalChangelog from "conventional-changelog";
import { cwd } from "process";
import { writeFile } from "./FileSystem";
import { getCommits } from "./GitCommands";
import { log } from "./Log";
import * as fs from "fs";

const changelogTemplate = (title: string) => `
# 1.0.0 (2023-03-01)

### Features

* **Login:** Added new login page ([#123](https://github.com/awesome-app/issues/123))

### Bug Fixes

* **Home:** Fixed issue with carousel not displaying properly ([#456](https://github.com/awesome-app/issues/456))

### Miscellaneous

* **Documentation:** Updated README file ([#789](https://github.com/awesome-app/issues/789))
`;

export async function generateChangelog(
  pkgPath: string,
  preset: string,
  latestVersion: string
) {
  const packageCommits = await getCommits(cwd());
  const fromCommit = packageCommits[packageCommits.length - 1];
  const toCommit = packageCommits[0];

  const options = {
    preset: preset,
    releaseCount: 0,
    outputUnreleased: true,
    pkg: { path: `${pkgPath}/package.json` },
    from: fromCommit,
    to: toCommit,
    // Define the formatting options for the changelog
    commit: "commits",
    issue: "issues",
    note: "notes",
    groupBy: "type",
    commitMessage: "commit",
    header: "# Changelog",
    mainTemplate:
      "{{#each commitGroups}}\n{{#if title}}\n## {{title}}\n{{/if}}{{#each commits}}\n- {{#if scope}}**{{scope}}:** {{/if}}{{{header}}} ([{{hash}}](https://github.com/user/repo/commit/{{hash}})){{#if note}} {{note}} {{/if}}\n{{/each}}{{/each}}\n",
  };

  const context = { version: latestVersion };

  const existingChangelog = fs.readFileSync(`${pkgPath}/CHANGELOG.md`, "utf-8");

  const outputStream = fs.createWriteStream(`${pkgPath}/CHANGELOG.md`, {
    flags: "w+",
  });

  // outputStream.write(existingChangelog);

  conventionalChangelog(options)
    .pipe(outputStream)
    .on("close", () => {
      console.log("Success");
    })
    .on("error", (err) => {
      console.log(err);
    });

  // return new Promise((resolve, reject) => {
  //   const changelogStream = conventionalChangelog(options, context);

  //   changelogStream.on("data", (chunk) => {
  //     const data = chunk.toString();
  //     fs.writeFile(`${pkgPath}/CHANGELOG.md`, data, "utf8", (err) => {
  //       if (err) {
  //         return reject(err);
  //       }
  //       resolve(data);
  //       log({
  //         step: "changelog_success",
  //         message: `Changelog generated successfully`,
  //         projectName: "Workspace",
  //       });
  //     });
  //   });
  // });
}

export function generateAllChangelogs(
  packages: string[],
  nextVersion: string,
  preset: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    packages.forEach(async (pkgPath) => {
      try {
        await generateChangelog(pkgPath, preset, nextVersion);
      } catch (err) {
        reject(err);
      }
      resolve(true);
    });
  });
}
