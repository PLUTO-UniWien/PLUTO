import { requireAuth } from '../../../../modules/auth/auth.utils';

const _GET = async (request: Request) => {
  return new Response(null, { status: 200 });
};

export const GET = requireAuth(_GET);
