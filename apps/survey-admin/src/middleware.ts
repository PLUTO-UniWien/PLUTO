import { NextRequest, NextResponse } from 'next/server';
import { env } from './env.mjs';
import { corsRes } from '@pluto/utils';

const allowedOriginsNoProtocol = env.NEXT_PUBLIC_ALLOWED_ORIGINS.split(',');
// Allow both http and https
const allowedOrigins = new Set([
  ...allowedOriginsNoProtocol.map((origin) => `http://${origin}`),
  ...allowedOriginsNoProtocol.map((origin) => `https://${origin}`),
]);

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const origin = requestHeaders.get('origin');
  if (origin && allowedOrigins.has(origin)) {
    return corsRes(response, {
      origin,
      methods: request.method,
      headers: 'Content-Type',
    });
  }

  return response;
}
