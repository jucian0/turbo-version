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
    console.log("GitHub user setup successfully.");

    const NPM_OPTIONAL_URL = core.getInput("npmRepository");

    writeNPMRC({
      token: NPM_TOKEN,
      filePath: NPMRC_PATH,
      repositoryURL: NPM_OPTIONAL_URL,
    });
    console.log("NPMRC user setup successfully.");

    writeNETRC({
      filePath: NETRC,
      ghToken: GH_TOKEN,
    });
    console.log("NETRC user setup successfully.");
  } catch (err: any) {
    throw Error(err);
  }
}
