import { NextRequest, NextResponse } from 'next/server';
import { env } from './env.mjs';
import { corsRes } from '@pluto/utils';

const allowedOrigins = [env.NEXT_PUBLIC_FRONTEND_URL];
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const origin = requestHeaders.get('origin');
  if (origin && allowedOrigins.includes(origin)) {
    return corsRes(response, {
      origin,
      methods: request.method,
      headers: 'Content-Type',
    });
  }

  return response;
}
