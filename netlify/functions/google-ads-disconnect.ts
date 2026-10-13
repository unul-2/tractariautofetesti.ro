import type { Config, Context } from '@netlify/functions';
import { getUser } from '@netlify/identity';
import { disconnectAds } from '../lib/google-ads-oauth';

export const config: Config = { method: 'POST', path: '/api/admin/google-ads/disconnect' };
export default async function handler(request: Request, _context: Context) {
  if (request.headers.get('origin') !== new URL(request.url).origin)
    return new Response('Invalid origin', { status: 403 });
  const user = await getUser();
  if (!user) return new Response('Login required', { status: 401 });
  if (!user.roles?.includes('admin')) return new Response('Admin only', { status: 403 });
  try {
    await disconnectAds();
    return Response.json({ disconnected: true }, { headers: { 'cache-control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Could not disconnect Google Ads' }, { status: 502 });
  }
}
