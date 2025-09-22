import { getGithubClient } from "../github-client";

export async function getRepository(owner: string, repo: string) {
  const response = await getGithubClient().rest.repos.get({
    owner,
    repo,
  });

  if (response.status !== 200 || !response.data) {
    throw new Error(`Failed to get repository: ${owner}/${repo}`);
  }

  return response.data;
}

export async function getRepositoryReadme(owner: string, repo: string) {
  const response = await getGithubClient().rest.repos.getReadme({
    owner,
    repo,
    mediaType: { format: "raw" },
  });

  if (response.status !== 200 || !response.data) {
    throw new Error(`Failed to get repository readme: ${owner}/${repo}`);
  }

  return response.data as unknown as string;
}

export async function getMarkdown(text: string) {
  const response = await getGithubClient().rest.markdown.render({
    text,
    mode: "gfm",
  });

  if (response.status !== 200 || !response.data) {
    throw new Error(`Failed to get repository markdown`);
  }

  return response.data;
}
