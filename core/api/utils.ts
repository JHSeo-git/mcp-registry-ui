import { errorResponseSchema } from "./error.schema";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

export const baseUrl = new URL(process.env.NEXT_PUBLIC_API_URL!);

export function resolveApiUrl(path: string) {
  if (typeof window !== "undefined") {
    return resolveApiUrlForClient(path);
  }

  let BASE_URL = baseUrl.href;

  if (!BASE_URL.endsWith("/")) {
    BASE_URL += "/";
  }
  return new URL(path, BASE_URL).toString();
}

export function resolveApiUrlForClient(path: string) {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  return path;
}

export async function apiErrorHandler(response: Response) {
  if (!response.ok) {
    let errorDetail = `HTTP error! status: ${response.status}`;
    try {
      const errorJson = await response.json();

      const parsedError = errorResponseSchema.safeParse(errorJson);

      if (parsedError.success) {
        errorDetail = parsedError.data.error;
      } else {
        errorDetail = errorJson.detail || JSON.stringify(errorJson);
      }
    } catch {
      // If parsing JSON fails, use the status text
      errorDetail = `${errorDetail} - ${response.statusText}`;
    }
    throw new Error(`Failed to upload documents: ${errorDetail}`);
  }
}
