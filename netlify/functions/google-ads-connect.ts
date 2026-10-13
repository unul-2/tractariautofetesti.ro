import type { Config, Context } from '@netlify/functions';
import { getUser } from '@netlify/identity';
import { oauthSetup, startAuthorization } from '../lib/google-ads-oauth';

export const config: Config = { method: 'GET', path: '/api/admin/google-ads/connect' };
export default async function handler(request: Request, _context: Context) {
  const user = await getUser();
  if (!user) return new Response('Login required', { status: 401 });
  if (!user.roles?.includes('admin')) return new Response('Admin only', { status: 403 });
  if (!oauthSetup().ready) return new Response('Google Cloud OAuth not configured', { status: 503 });
  try { return startAuthorization(request, user.id); }
  catch { return new Response('OAuth host mismatch or setup incomplete', { status: 400 }); }
}
