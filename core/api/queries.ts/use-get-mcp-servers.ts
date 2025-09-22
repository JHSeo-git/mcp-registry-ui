import { useQuery } from "@tanstack/react-query";
import type { ServerListRequest } from "../schema";
import { getMCPServers } from "../server";

function useGetMCPServers(request: ServerListRequest) {
  return useQuery({
    queryKey: generateQueryKey(request),
    queryFn: () => getMCPServers(request),
  });
}

const generateQueryKey = (request: ServerListRequest) => {
  return ["v0", "servers", request];
};
useGetMCPServers.generateQueryKey = generateQueryKey;

export { useGetMCPServers };
