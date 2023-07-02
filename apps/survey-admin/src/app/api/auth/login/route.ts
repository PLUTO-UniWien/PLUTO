import {
  USER_JWT_COOKIE_NAME,
  UserLogin,
  UserWithJwt,
} from '@pluto/survey-model';
import { strapiFetch } from '../../../../modules/strapi/strapi.utils';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const payload: UserLogin = await request.json();
  const res = await strapiFetch(
    '/auth/local',
    {},
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    },
    false
  );
  if (res.ok) {
    const { jwt }: UserWithJwt = await res.json();
    // respond with 200 and set cookie
    const cookie = cookies().set(USER_JWT_COOKIE_NAME, jwt, {
      secure: true,
      httpOnly: false,
      path: '/',
      sameSite: 'none',
    });
    return NextResponse.json(
      { jwt },
      {
        status: 200,
        headers: {
          'Set-Cookie': cookie.toString(),
        },
      }
    );
  }
  return res;
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
  });
}
