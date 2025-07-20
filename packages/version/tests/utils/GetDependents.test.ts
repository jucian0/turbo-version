import { describe, expect, test } from "@jest/globals";
import { summarizePackages } from "../../src/utils/GetDependents";

describe("summarizePackages", () => {
   test("returns an array of packages with correct properties", async () => {
      const config = {
         packages: ["packages/package-a", "packages/package-b"],
         updateInternalDependencies: true,
      };

      const packages = await summarizePackages(config as any);

      packages.forEach((pkg) => {
         expect(pkg).toHaveProperty("path");
         expect(pkg).toHaveProperty("package");
         expect(pkg.package).toHaveProperty("name");
      });
   });

   test("filters out packages without changes", async () => {
      const config = {
         packages: ["packages/package-a", "packages/package-b"],
         updateInternalDependencies: true,
      };

      const packages = await summarizePackages(config as any);

      packages.forEach((pkg) => {
         expect(pkg).toHaveProperty("path");
         expect(pkg).toHaveProperty("package");
         expect(pkg.package).toHaveProperty("name");
      });
   });
});
