import type { Config, Context } from '@netlify/functions';
import { getUser } from '@netlify/identity';
import {
  createEditSessionCookie,
  verifyPinAttempt,
} from '../lib/admin-ads-security';

export const config: Config = {
  method: 'POST',
  path: '/api/admin/google-ads/unlock',
};

const handler = async (request: Request, _context: Context) => {
  const user = await getUser();
  if (!user) return new Response('Authentication required', { status: 401 });
  if (!user.roles?.includes('admin')) {
    return new Response('Administrator access required', { status: 403 });
  }

  let body: { pin?: string };
  try {
    body = (await request.json()) as { pin?: string };
  } catch {
    return Response.json({ ok: false, reason: 'invalid_request' }, { status: 400 });
  }

  const result = await verifyPinAttempt(user, String(body.pin ?? ''));

  if (!result.ok) {
    if (result.reason === 'not_configured') {
      return Response.json(
        { ok: false, reason: result.reason },
        { status: 503, headers: { 'cache-control': 'no-store' } },
      );
    }

    if (result.reason === 'locked') {
      return Response.json(
        { ok: false, reason: result.reason, lockUntil: result.lockUntil },
        { status: 429, headers: { 'cache-control': 'no-store' } },
      );
    }

    return Response.json(
      {
        ok: false,
        reason: result.reason,
        attemptsRemaining: result.attemptsRemaining,
      },
      { status: 401, headers: { 'cache-control': 'no-store' } },
    );
  }

  const session = createEditSessionCookie(user);
  return Response.json(
    { ok: true, expiresAt: session.expiresAt },
    {
      headers: {
        'cache-control': 'no-store',
        'set-cookie': session.header,
      },
    },
  );
};

export default handler;
