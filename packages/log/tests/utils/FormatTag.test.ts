import { describe, expect, test } from "@jest/globals";
import { formatTag, formatTagPrefix } from "../../src/utils/FormatTag";

describe("formatTagPrefix", () => {
   test("returns tagPrefix with substituted variables when tagPrefix is defined", () => {
      const result = formatTagPrefix({
         tagPrefix: "v${target}-",
         name: "my-package",
         synced: false,
      });
      expect(result).toBe("vmy-package-");
   });

   test('returns "v" when synced is true and tagPrefix is not defined', () => {
      const result = formatTagPrefix({ synced: true });
      expect(result).toBe("v");
   });

   test("returns name with hyphen when synced is false and tagPrefix is not defined", () => {
      const result = formatTagPrefix({ name: "my-package", synced: false });
      expect(result).toBe("my-package-");
   });
});

describe("formatTag", () => {
   test("returns tag with prefix", () => {
      const result = formatTag({ tagPrefix: "v", version: "1.0.0" });
      expect(result).toBe("v1.0.0");
   });
});
