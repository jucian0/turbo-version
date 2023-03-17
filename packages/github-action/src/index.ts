import * as core from "@actions/core";
import { setupUser, writeNETRC, writeNPMRC } from "./utils";

export async function action() {
  try {
    const GH_TOKEN = process.env.GITHUB_TOKEN;
    const NPM_TOKEN = process.env.NPM_TOKEN;
    const NPMRC_PATH = `${process.env.HOME}/.npmrc`;
    const NETRC = `${process.env.HOME}/.netrc`;

    if (!GH_TOKEN) {
      throw Error("Please verify your GITHUB_TOKEN, and try again!");
    }

    if (!NPM_TOKEN) {
      throw Error("Please verify your NPM_TOKEN, and try again!");
    }

    await setupUser();

    const NPM_OPTIONAL_URL = core.getInput("npmRepository");

    writeNPMRC({
      token: NPM_TOKEN,
      filePath: NPMRC_PATH,
      repositoryURL: NPM_OPTIONAL_URL,
    });

    writeNETRC({
      filePath: NETRC,
      ghToken: GH_TOKEN,
    });
  } catch (err) {
    console.error(err);
  }
}
