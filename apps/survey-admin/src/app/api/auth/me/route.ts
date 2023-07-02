import { strapiFetch } from '../../../../modules/strapi/strapi.utils';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { USER_JWT_COOKIE_NAME } from '@pluto/survey-model';

function tryExtractToken(request: Request) {
  const tokenFromHeader = request.headers.get('Authorization')?.split(' ')[1];
  if (tokenFromHeader) {
    return tokenFromHeader;
  }
  const tokenFromCookie = cookies().get(USER_JWT_COOKIE_NAME)?.value;
  if (tokenFromCookie) {
    return tokenFromCookie;
  }
  return null;
}

export async function GET(request: Request) {
  const token = tryExtractToken(request);
  if (!token) {
    return NextResponse.json(
      { error: 'No token in found in request' },
      { status: 401 }
    );
  }
  const res = await strapiFetch(
    '/users/me',
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    false
  );
  if (res.ok) {
    return new Response(null, { status: 200 });
  }
  return res;
}
