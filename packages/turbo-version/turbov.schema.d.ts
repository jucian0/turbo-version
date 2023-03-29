export type Preset = "angular" | "conventional" | "conventionalcommits";

export type WriteChangelogConfig = {
  changelogHeader: string;
  projectRoot: string;
  preset: Preset;
  dryRun?: boolean;
  changelogPath: string;
  tagPrefix: string;
  skip?:string[]
};
