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
  packages: string[];
  updateInternalDependencies:
    | "major"
    | "minor"
    | "patch"
    | "no-internal-update";
  strategy: "first-release" | "next-release" | "last-release";
};

export type LogStep =
  | "nothing_changed"
  | "failure"
  | "warning"
  | "calculate_version_success"
  | "package_json_success"
  | "changelog_success"
  | "tag_success"
  | "post_target_success"
  | "push_success"
  | "commit_success";

export type LogProps = {
  step: LogStep;
  message: string;
  pkgName: string;
};
