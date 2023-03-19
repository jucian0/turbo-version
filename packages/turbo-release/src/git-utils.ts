import { promisify } from "./utils";

export async function pullBranch(branch: string) {
  await promisify(`git pull origin ${branch}`);
}

export async function push(branch: string, { force }: any = {}) {
  await promisify(`git push origin HEAD:${branch} --force`);
}

export async function pushTags() {
  await promisify("git push origin --tags");
}
