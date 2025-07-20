import { describe, expect, jest, test } from "@jest/globals";
import { generateVersion } from "../../src/utils/GenerateVersion";

describe("generateVersion", () => {
   const latestTag = "v1.0.0";
   const preset = "angular";
   const tagPrefix = "v";
   const path = ".";
   const name = "test-package";

   test("should generate a new version", async () => {
      const type = "minor";
      const result = await generateVersion({
         latestTag,
         preset,
         tagPrefix,
         type,
         path,
         name,
      });
      expect(result).toMatch(/^\d+\.\d+\.\d+$/);
   });

   test("should handle an error and return null", async () => {
      // Pass an invalid preset to trigger an error
      const invalidPreset = "invalid-preset";
      const result = await generateVersion({
         latestTag,
         preset: invalidPreset,
         tagPrefix,
         path,
         name,
      });
      expect(result).toBeNull();
   });

   test("should handle no changes since last release and return null", async () => {
      // Set amountCommits to 0 to simulate no changes since last release
      const amountCommits = 0;
      jest.spyOn(global.process, "cwd").mockReturnValue(path);
      jest
         .spyOn(require("../../src/utils/GitCommands"), "getCommitsLength")
         .mockReturnValue(amountCommits);

      const result = await generateVersion({
         latestTag,
         preset,
         tagPrefix,
         path,
         name,
      });
      expect(result).toBeNull();
   });

   test("should handle bump type and return a new version", async () => {
      const amountCommits = 1;
      jest.spyOn(global.process, "cwd").mockReturnValue(path);
      jest
         .spyOn(require("../../src/utils/GitCommands"), "getCommitsLength")
         .mockReturnValue(amountCommits);

      const result = await generateVersion({
         latestTag,
         preset,
         tagPrefix,
         path,
         name,
      });
      expect(result).toEqual("1.1.0");
   });
});
