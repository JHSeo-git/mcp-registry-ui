import { Octokit } from "octokit";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

let _cache: Octokit | null = null;

export function getGithubClient() {
  if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is not set");
  }

  if (_cache) {
    return _cache;
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN });
  _cache = octokit;

  return octokit;
}
