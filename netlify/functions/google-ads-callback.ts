import type { Config, Context } from '@netlify/functions';
import { getUser } from '@netlify/identity';
import { deleteCookie, exchangeCode, storeRefreshToken, verifyCallback } from '../lib/google-ads-oauth';

export const config: Config = { method: 'GET', path: '/api/admin/google-ads/callback' };
export default async function handler(request: Request, _context: Context) {
  const user = await getUser();
  if (!user) return new Response('Admin login expired. Sign in and retry.', { status: 401 });
  if (!user.roles?.includes('admin')) return new Response('Admin only', { status: 403 });
  const query = new URL(request.url).searchParams;
  const state = query.get('state') || '';
  try {
    const verifier = verifyCallback(request, state, user.id);
    const code = query.get('code');
    if (query.has('error') || !code || code.length > 2048) throw new Error('OAuth not granted');
    const refreshToken = await exchangeCode(code, verifier);
    await storeRefreshToken(refreshToken, user.id);
    return new Response(null, {
      status: 303,
      headers: {
        location: '/admin?ads=connected', 'cache-control': 'no-store',
        'referrer-policy': 'no-referrer', 'set-cookie': deleteCookie,
      },
    });
  } catch {
    return new Response(null, {
      status: 303,
      headers: {
        location: '/admin?ads=authorization-failed', 'cache-control': 'no-store',
        'referrer-policy': 'no-referrer', 'set-cookie': deleteCookie,
      },
    });
  }
}
