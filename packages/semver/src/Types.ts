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
