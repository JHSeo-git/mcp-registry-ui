"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useGetMCPServersInfinite } from "@/core/api/queries.ts/use-get-mcp-servers-infinite";
import type { Repository } from "@/core/api/schema";
import { MCPCard } from "./mcp-card";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";

const formSchema = z.object({
  search: z.string().optional(),
});

export function McpCardList() {
  const [search, setSearch] = useState<string>("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error } =
    useGetMCPServersInfinite({ limit: 30, search });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSearch(values.search ?? "");
  }

  useEffect(() => {
    if (!error) {
      return;
    }

    toast.error(error.message);
  }, [error]);

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <h2 className="font-semibold text-xl leading-normal">MCP Servers</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full max-w-96 items-center gap-1"
          >
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Search MCPs"
                        {...field}
                        className="pr-10"
                      />
                      {field.value && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="-translate-y-1/2 absolute top-1/2 right-2 size-6 rounded-full"
                          onClick={() => field.onChange("")}
                        >
                          <XIcon className="size-3" />
                        </Button>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" variant="outline" size="icon">
              <SearchIcon />
            </Button>
          </form>
        </Form>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.pages.map((group) =>
          group.servers?.map((server) => (
            <MCPCard
              key={server.name}
              name={server.name}
              description={server.description}
              repositoryUrl={getGithubUrl(server.repository)}
            />
          )),
        )}
      </div>
      {/* TODO: intersection observer */}
      {hasNextPage && (
        <div className="mt-10 flex justify-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? "Loading more..." : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}

const getGithubUrl = (repository?: Repository) => {
  if (!repository?.source || repository.source.toLowerCase() !== "github") {
    return;
  }

  return repository.url;
};
