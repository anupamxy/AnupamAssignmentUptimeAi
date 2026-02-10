export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string | null;
  bio: string;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  fork: boolean;
  language: string;
  stargazers_count: number;
  forks_count: number;
  visibility: string;
  updated_at: string;
  topics?: string[];
  license?: { spdx_id: string; name: string } | null;
  parent?: {
    full_name: string;
  };
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface GitHubFollower {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

export interface GitHubGist {
  id: string;
  html_url: string;
  description: string;
  public: boolean;
  created_at: string;
  updated_at: string;
  comments: number;
  files: { [key: string]: { filename: string; language: string; size: number } };
}

export interface GitHubGPGKey {
  id: number;
  key_id: string;
  emails: { email: string; verified: boolean }[];
  created_at: string;
  expires_at: string | null;
  can_sign: boolean;
  can_encrypt_comms: boolean;
  can_certify: boolean;
}

export interface GitHubSSHKey {
  id: number;
  key: string;
  created_at: string;
}

export interface GitHubSSHSigningKey {
  id: number;
  key: string;
  title: string;
  created_at: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: { login: string; avatar_url: string };
  repo: { name: string; url: string };
  payload: any;
  created_at: string;
}

export interface GitHubSubscription {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  owner: { login: string; avatar_url: string };
}
