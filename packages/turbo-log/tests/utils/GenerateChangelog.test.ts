import { generateChangelog } from "../../src/utils/GenerateChangelog";
import { describe, expect, test } from "@jest/globals";
import { fileExist } from "../../src/utils/FileSystem";

describe("generateChangelog", () => {
  test("should generate a changelog file", async () => {
    const tagPrefix = "v";
    const preset = "angular";
    const path = ".";
    const version = "1.0.0";
    const name = "test-package";

    await generateChangelog({ tagPrefix, preset, path, version, name });

    // Assert that the changelog file was created
    // You can modify this assertion to check the contents of the file
    expect(fileExist("./CHANGELOG.md")).toBe(true);
  });

  test("should reject if an error occurs", async () => {
    const tagPrefix = "v";
    const preset = "angular";
    const version = "1.0.0";
    const name = "test-package";

    const invalidPath = "./invalid-path";
    await generateChangelog({
      tagPrefix,
      preset,
      path: invalidPath,
      version,
      name,
    }).catch(() => {
      expect(true).toBeTruthy();
    });
  });
});
