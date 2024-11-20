import { afterEach, describe, expect, jest, test } from "@jest/globals";
import gitSemverTags from "git-semver-tags";
import { getLatestTag } from "../../src/utils/GetLatestTag";

jest.mock("git-semver-tags");

describe("getLatestTag", () => {
   afterEach(() => {
      jest.resetAllMocks();
   });

   test("should return the latest tag with the specified prefix", async () => {
      const versions = ["v1.2.0", "v1.0.1", "v1.0.0"];
      (gitSemverTags as any).mockImplementationOnce((options: any, cb: any) => {
         cb(null, versions);
      });

      const latestTag = await getLatestTag("v");
      console.log(latestTag);
      expect(latestTag).toBe("v1.2.0");
   });

   test("should return an empty string if no tags are found", async () => {
      (gitSemverTags as any).mockImplementationOnce((options: any, cb: any) => {
         cb(null, []);
      });

      const latestTag = await getLatestTag("v1");
      expect(latestTag).toBe("");
   });

   test("should handle errors gracefully", async () => {
      const error = new Error("Failed to get tags");
      (gitSemverTags as any).mockImplementationOnce((options: any, cb: any) => {
         cb(error);
      });

      await expect(getLatestTag("v1")).rejects.toThrow(error);
   });
});
