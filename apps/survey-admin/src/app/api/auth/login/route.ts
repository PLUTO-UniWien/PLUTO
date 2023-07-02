import {
  USER_JWT_COOKIE_NAME,
  UserLogin,
  UserWithJwt,
} from '@pluto/survey-model';
import { strapiFetch } from '../../../../modules/strapi/strapi.utils';
import { cookies } from 'next/headers';

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
    cookies().set(USER_JWT_COOKIE_NAME, jwt, { secure: true });
    return new Response(null, { status: 200 });
  }
  return res;
}
