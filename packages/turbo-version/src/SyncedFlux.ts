import { cwd } from "process";
import { formatTag, formatTagPrefix } from "./utils/FormatTag";
import { generateChangelog } from "./utils/GenerateChangelog";
import { generateVersion } from "./utils/GenerateVersion";
import { getLatestTag } from "./utils/GetLatestTag";
import { Config, PkgJson } from "./Types";
import { updatePackageVersion } from "./utils/UpdatePackageVersion";
import { readJsonFile } from "@turbo-version/fs";
import { gitProcess, createGitTag } from "@turbo-version/git";

export async function syncedFlux(config: Config, type?: any) {
  try {
    const tagPrefix = formatTagPrefix({
      synced: config.synced,
    });
    const { preset, baseBranch: branch } = config;

    const latestTag = await getLatestTag(tagPrefix);

    const version = await generateVersion({
      latestTag,
      preset,
      tagPrefix,
      type,
    });

    if (version) {
      const nextTag = formatTag({ tagPrefix, version });

      for (const pkg of config.packages) {
        const pkgJson = readJsonFile<PkgJson>(`${pkg}/package.json`);
        const name = pkgJson.name;

        await updatePackageVersion({ path: pkg, version, name });
        await generateChangelog({
          tagPrefix,
          preset,
          path: pkg,
          version,
          name,
        });
      }
      await gitProcess({ files: [cwd()], nextTag, branch });

      await createGitTag({
        tag: "latest",
        args: "--force",
      });
    }
  } catch (err) {
    return err;
  }
}
