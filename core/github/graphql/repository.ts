import type { Repository } from "@octokit/graphql-schema";

import { getGithubClient } from "../github-client";

const query = `
    query Repository($owner: String!, $repo: String!, $first: Int = 10) {
        repository(owner: $owner, name: $repo) {
            id
            name
            nameWithOwner
            owner {
                id
                avatarUrl
                login
            }    
            url
            updatedAt
            primaryLanguage {
                id
                name
                color
            }
            stargazerCount
            licenseInfo {
                id
                name
            }
            repositoryTopics(first: $first) {
                totalCount
                nodes {
                    topic {
                        id
                        name
                    }
                }
            }        
            readme_md: object(expression: "HEAD:README.md") { ...blob }
        }
    }

    fragment blob on GitObject {
        __typename
        ... on Blob { byteSize isBinary text }
    }
`;

type ReadmeBlob = {
  readme_md?: {
    __typename: "Blob";
    byteSize: number;
    isBinary: boolean;
    text: string;
  } | null;
};

export async function getRepository(owner: string, repo: string) {
  const result = await getGithubClient().graphql<{
    repository: Repository & ReadmeBlob;
  }>(query, { owner, repo });

  return result.repository;
}
