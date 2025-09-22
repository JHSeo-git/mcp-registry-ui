"use client";

import Link from "next/link";
import { getServerOwner, getServerTitle } from "@/lib/mcp-card-utils";

interface MCPCardProps {
  name: string;
  description: string;
  repositoryUrl?: string;
}

export function MCPCard({ name, description, repositoryUrl }: MCPCardProps) {
  return (
    <div className="relative flex min-h-[160px] flex-col overflow-hidden rounded-md border bg-background">
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="font-semibold">
          <Link href={`/mcp/${name}`} className="card-link">
            {getServerTitle(name)}
          </Link>
        </h3>
        <p className="line-clamp-3 text-foreground/80 text-sm">{description}</p>
      </div>
      <div className="flex items-center gap-3 px-4 pb-4 text-foreground/80">
        <p className="text-xs">
          By{" "}
          <span className="isolate font-semibold">
            {repositoryUrl ? (
              <a
                className="font-semibold text-link hover:underline"
                target="_blank"
                href={repositoryUrl}
                rel="noreferrer"
              >
                {getServerOwner(name)}
              </a>
            ) : (
              getServerOwner(name)
            )}
          </span>
        </p>
        <div></div>
      </div>
    </div>
  );
}
