import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import type { ServerListRequest } from "../schema";
import { getMCPServers } from "../server";

function useGetMCPServersInfinite(request: Omit<ServerListRequest, "cursor">) {
  return useInfiniteQuery({
    queryKey: generateQueryKey(request),
    queryFn: ({ pageParam }) =>
      getMCPServers({ ...request, cursor: pageParam }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.metadata?.next_cursor,
    placeholderData: keepPreviousData,
  });
}

const generateQueryKey = (request: Omit<ServerListRequest, "cursor">) => {
  return ["v0", "servers", request];
};
useGetMCPServersInfinite.generateQueryKey = generateQueryKey;

export { useGetMCPServersInfinite };
