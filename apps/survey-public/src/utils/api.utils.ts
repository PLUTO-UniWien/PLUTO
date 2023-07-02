import { constructFetchUrl } from '@pluto/utils';

function apiUrl(path: string) {
  return `${process.env.VUE_APP_BACKEND_URL}${path}`;
}

/**
 * Fetches from the API with the correct authorization header.
 *
 * @param baseUrl - the path to fetch from
 * @param params - optional query params
 * @param init - the fetch init object
 */
export function apiFetch(
  baseUrl: string,
  params: Record<string, string> = {},
  init?: RequestInit
) {
  const path = constructFetchUrl(baseUrl, params);
  const url = apiUrl(path);
  return fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
    },
  });
}
