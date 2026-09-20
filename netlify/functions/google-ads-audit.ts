import type { Config, Context } from '@netlify/functions';
import { getUser } from '@netlify/identity';
import { readAdminAudit } from '../lib/admin-ads-security';

export const config: Config = {
  method: 'GET',
  path: '/api/admin/google-ads/audit',
};

const handler = async (request: Request, _context: Context) => {
  const user = await getUser();
  if (!user) return new Response('Authentication required', { status: 401 });
  if (!user.roles?.includes('admin')) {
    return new Response('Administrator access required', { status: 403 });
  }

  const params = new URL(request.url).searchParams;
  const requestedDays = Number(params.get('days') ?? 30);
  const requestedLimit = Number(params.get('limit') ?? 30);

  const days = Number.isInteger(requestedDays)
    ? Math.min(Math.max(requestedDays, 1), 90)
    : 30;
  const limit = Number.isInteger(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 100)
    : 30;

  const events = await readAdminAudit(days, limit);

  return Response.json(
    {
      days,
      count: events.length,
      events,
    },
    { headers: { 'cache-control': 'no-store' } },
  );
};

export default handler;
