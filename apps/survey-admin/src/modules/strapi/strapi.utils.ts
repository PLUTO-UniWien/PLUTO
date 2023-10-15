import { env } from '../../env.mjs';
import { constructFetchUrl, extractError } from '@pluto/utils';
import { NextResponse } from 'next/server';
import { requireAuth } from '../auth/auth.utils';

function strapiUrl(path: string) {
  return `${env.NEXT_PUBLIC_STRAPI_URL}${path}`;
}

/**
 * Fetches from Strapi with the correct authorization header.
 *
 * @param baseUrl - the path to fetch from
 * @param params - optional query params
 * @param init - the fetch init object
 * @param withAuth - whether to include the Admin authorization header
 */
export function strapiFetch(
  baseUrl: string,
  params: Record<string, string> = {},
  init?: RequestInit,
  withAuth = true
) {
  const path = constructFetchUrl(baseUrl, params);
  const url = strapiUrl(path);
  return fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
      ...(withAuth ? { Authorization: `bearer ${env.STRAPI_API_KEY}` } : {}),
    },
    cache: 'no-store'
  });
}

export function singleTypeGetter(
  slug: string,
  params: Record<string, string> = {}
) {
  async function GET() {
    const response = await strapiFetch(slug, params);

    if (!response.ok) {
      return NextResponse.json(await extractError(response), {
        status: response.status,
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  }
  return requireAuth(GET);
}
