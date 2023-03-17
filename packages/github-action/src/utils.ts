import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import { type } from "os";

const promisifiedExec = promisify(exec);

export async function pullBranch(branch: string) {
  await promisifiedExec(`git pull origin ${branch}`);
}

export async function push(branch: string, { force }: any = {}) {
  await promisifiedExec(`git push origin HEAD:${branch} --force`);
}

export async function pushTags() {
  await promisifiedExec("git push origin --tags");
}

type NPMRC = {
  repositoryURL?: string;
  token: string;
  filePath: string;
};

export function writeNPMRC(npmrcOptions: NPMRC) {
  const URL = npmrcOptions.repositoryURL ?? "registry.npmjs.org";
  fs.writeFileSync(
    npmrcOptions.filePath,
    `\n//${URL}/:_authToken=${process.env.NPM_TOKEN}\n`
  );
}

export async function setupUser() {
  await promisifiedExec("git config user.name 'github-actions[bot]'");
  await promisifiedExec(
    "git config user.email 'github-actions[bot]@users.noreply.github.com'"
  );
}

type GHCredentials = {
  filePath: string;
  ghToken: string;
};

export function writeNETRC(args: GHCredentials) {
  fs.writeFileSync(
    args.filePath,
    `machine github.com\nlogin github-actions[bot]\npassword ${args.ghToken}`
  );
}
