export type Commit = {
  hash: string;
  message: string;
};

export type GitCommitOptions = {
  message: string;
  amend?: boolean;
  author?: string;
  date?: string;
};

export type GitTagOptions = {
  tag: string;
  message?: string;
  annotated?: boolean;
};

export type Config = {
  tagPrefix: string;
  preset: string;
  baseBranch: string;
  synced: boolean;
  workspace: string[];
  updateInternalDependencies:
    | "major"
    | "minor"
    | "patch"
    | "no-internal-update";
  strategy: "first-release" | "next-release" | "last-release";
};
