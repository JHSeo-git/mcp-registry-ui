import queryString from "query-string";

import { apiClient } from "./api-client";
import {
  type ServerDetailRequest,
  type ServerListRequest,
  serverJsonSchema,
  serverListResponseSchema,
} from "./schema";
import {
  apiErrorHandler,
  resolveApiUrl,
  resolveApiUrlForClient,
} from "./utils";

export async function getMCPServers(
  request: ServerListRequest = { limit: 30, version: "latest" },
) {
  const qs = queryString.stringify(request);
  const url = resolveApiUrl(`v0/servers?${qs}`);
  const response = await apiClient(url);

  await apiErrorHandler(response);

  const data = await response.json();

  const parsedData = await serverListResponseSchema.safeParseAsync(data);

  if (!parsedData.success) {
    throw new Error(`Invalid response from API: ${parsedData.error.message}`);
  }

  return parsedData.data;
}

export async function getMCPServerDetail(request: ServerDetailRequest) {
  const url = resolveApiUrl(`v0/servers/${request.id}`);

  const response = await apiClient(url);

  await apiErrorHandler(response);

  const data = await response.json();

  const parsedData = await serverJsonSchema.safeParseAsync(data);

  if (!parsedData.success) {
    throw new Error(`Invalid response from API: ${parsedData.error.message}`);
  }

  return parsedData.data;
}
