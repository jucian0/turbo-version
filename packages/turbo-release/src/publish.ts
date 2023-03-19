import { promisify } from "./utils";

export function publish(path?: string) {
  return promisify(`npm run publish ${path ?? ""}`);
}
