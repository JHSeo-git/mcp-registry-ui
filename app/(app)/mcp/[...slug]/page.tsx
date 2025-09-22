import { formatDistanceToNowStrict } from "date-fns";
import {
  BookMarkedIcon,
  MessagesSquareIcon,
  ScaleIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { GithubMarkdown } from "@/components/github-markdown";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getMCPServers } from "@/core/api/server";
import { getRepository } from "@/core/github/graphql/repository";
import { getMarkdown } from "@/core/github/rest/repository";
import { getServerOwner, getServerTitle } from "@/lib/mcp-card-utils";

type PageProps = {
  params: Promise<{ slug: string[] }>; // catch-all → string[]
};

export default async function ServerDetailPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug.length === 0) {
    return notFound();
  }

  // search mcp server
  const found = await getMCPServers({ limit: 1, search: slug.join("/") });

  if (!found.servers || found.servers.length === 0) {
    return notFound();
  }

  const server = found.servers[0];

  // check domain
  const domain = getDomain(server.name);

  // TODO: custom
  if (domain === "CUSTOM") {
    return (
      <div className="text-lg">
        Custom Domain is not supported, currently <strong>ONLY</strong> Github
        namespace is supported
      </div>
    );
  }

  // github
  const { owner, repo } = getGithubOwnerRepo(server.name);

  if (!owner || !repo) {
    return notFound();
  }

  const repository = await getRepository(owner, repo);

  const markdown =
    repository.readme_md?.text &&
    (await getMarkdown(repository.readme_md.text));

  return (
    <div className="flex flex-col gap-9 md:grid md:grid-cols-[300px_minmax(0,1fr)] md:gap-16">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border p-2">
              <Image
                src={repository.owner.avatarUrl}
                alt={repository.owner.login}
                className="h-auto w-full"
                width={30}
                height={30}
              />
            </div>
            <p className="font-semibold text-lg">
              {getServerTitle(server.name)}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="break-words text-sm">{server.description}</p>
            <p className="text-xs">
              By{" "}
              <span className="isolate font-semibold">
                {repository ? (
                  <a
                    className="font-semibold text-link hover:underline"
                    target="_blank"
                    href={repository.url}
                    rel="noreferrer"
                  >
                    {getServerOwner(server.name)}
                  </a>
                ) : (
                  getServerOwner(server.name)
                )}
              </span>
            </p>
          </div>

          <div className="flex gap-4">
            {repository.primaryLanguage && (
              <div className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full bg-blue-500"
                  style={{
                    backgroundColor:
                      repository.primaryLanguage.color ?? "inherit",
                  }}
                />
                <span className="text-foreground/80 text-xs">
                  {repository.primaryLanguage.name}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <StarIcon className="size-3" />
              <span className="text-foreground/80 text-xs tabular-nums">
                {formatNumber(repository.stargazerCount ?? 0)}
              </span>
            </div>

            {repository.licenseInfo && (
              <div className="flex items-center gap-2">
                <ScaleIcon className="size-3" />
                <span className="text-foreground/80 text-xs">
                  {repository.licenseInfo.name}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="hidden flex-col gap-9 md:flex">
          {repository.repositoryTopics.totalCount !== 0 && (
            <>
              <Separator />

              <div className="flex flex-col gap-4">
                <h2 className="font-semibold text-sm">
                  <span>Tags</span>
                  <Badge variant="secondary" className="ml-2 rounded-full">
                    {repository.repositoryTopics.totalCount}
                  </Badge>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {repository.repositoryTopics.nodes?.map(
                    (node) =>
                      node && (
                        <Badge
                          variant="secondary"
                          className="rounded-full text-muted-foreground"
                          key={node.topic.id}
                        >
                          {node.topic.name}
                        </Badge>
                      ),
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-sm">
              <span>Resources</span>
            </h2>
            <div className="flex flex-col gap-2">
              <a
                href={repository.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-foreground/80 hover:text-link"
              >
                <BookMarkedIcon className="size-4" />
                <span className="text-sm">View source code</span>
              </a>
              <a
                href="https://support.github.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-foreground/80 hover:text-link"
              >
                <MessagesSquareIcon className="size-4" />
                <span className="text-sm">Support</span>
              </a>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-sm">
              <span>Last updated:</span>
              <span className="ml-1 font-normal">
                {getDistanceFromNow(repository.updatedAt)} ago
              </span>
            </h2>
          </div>
        </div>
      </div>

      {markdown && <GithubMarkdown html={markdown} />}
    </div>
  );
}

const getDomain = (serverName: string) => {
  if (serverName.startsWith("io.github.")) {
    return "GITHUB";
  }

  return "CUSTOM";
};

const getGithubOwnerRepo = (serverName: string) => {
  const parsed = serverName.replace("io.github.", "");

  const [owner, repo] = parsed.split("/");

  return { owner, repo };
};

const getDistanceFromNow = (date: string) => {
  return formatDistanceToNowStrict(new Date(date));
};

const formatNumber = (number: number) => {
  return new Intl.NumberFormat("en-US").format(number);
};
