export async function apiClient(
  input: string | URL | globalThis.Request,
  init?: RequestInit,
  retry = true,
) {
  //   const { accessToken } = useTokenStore.getState()

  const headers = new Headers(init?.headers || {});
  //   if (accessToken) {
  //     headers.set("Authorization", `Bearer ${accessToken}`)
  //   }

  const response = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  //   if (response.status === 401 && retry) {
  //     clearTokens()

  //     const response = await refreshToken()
  //     const newAccessToken = response?.access_token

  //     if (newAccessToken) {
  //       refresh(newAccessToken)

  //       const retryHeaders = new Headers(init?.headers || {})
  //       retryHeaders.set("Authorization", `Bearer ${newAccessToken}`)

  //       // re-fetch for origin request
  //       return apiClient(input, { ...init, headers: retryHeaders }, false)
  //     }

  //     throw new Error("Unauthorized and refresh failed")
  //   }

  return response;
}
