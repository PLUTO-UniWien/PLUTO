import { env } from '../../env.mjs';
import { constructFetchUrl, extractError } from '../utils/fetch.utils';
import { NextResponse } from 'next/server';

function strapiUrl(path: string) {
  return `${env.NEXT_PUBLIC_STRAPI_URL}${path}`;
}

/**
 * Fetches from Strapi with the correct authorization header.
 *
 * @param baseUrl - the path to fetch from
 * @param params - optional query params
 * @param init - the fetch init object
 */
export function strapiFetch(
  baseUrl: string,
  params: Record<string, string> = {},
  init?: RequestInit
) {
  const path = constructFetchUrl(baseUrl, params);
  const url = strapiUrl(path);
  return fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `bearer ${env.STRAPI_API_KEY}`,
    },
  });
}

export function singleTypeGetter(slug: string) {
  async function GET() {
    const response = await strapiFetch(slug);

    if (!response.ok) {
      return NextResponse.json(await extractError(response), {
        status: response.status,
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  }
  return GET;
}
