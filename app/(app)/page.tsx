import Image from "next/image";
import MCPLogo from "@/components/images/mcp-logo.png";
import { McpCardList } from "@/components/mcp-card-list";

export default async function HomePage() {
  return (
    <div>
      <header className="bg-linear-to-b from-cyan-50 p-8 md:px-12 md:py-16">
        <div className="mx-auto flex flex-col items-center gap-5">
          <Image src={MCPLogo} alt="MCP Logo" width={86} className="" />
          <div className="flex max-w-prose flex-col text-center">
            <h1 className="font-bold text-3xl leading-normal">
              Connect models to the real world
            </h1>
            <p className="text-balance text-muted-foreground text-xl">
              Servers and tools from the community that connect models to files,
              APIs, databases, and more.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[80rem] px-4 pb-10">
        <McpCardList />
      </main>
    </div>
  );
}
