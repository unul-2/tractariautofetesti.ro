import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { getStore } from '@netlify/blobs';

const store = 'tractari-ads-oauth';
const cookieName = '__Host-taf_ads_auth';
const scope = 'https://www.googleapis.com/auth/adwords';
const callbackPath = '/api/admin/google-ads/callback';

function key() {
  const secret = Buffer.from(process.env.GOOGLE_ADS_OAUTH_ENCRYPTION_KEY || '', 'base64');
  return secret.length === 32 ? secret : null;
}
function seal(value: unknown): string {
  const secret = key();
  if (!secret) throw new Error('Encryption key not configured');
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', secret, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(value)), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map(v => v.toString('base64url')).join('.');
}
function unseal<T>(value: string): T {
  const secret = key();
  if (!secret) throw new Error('Encryption key not configured');
  const parts = value.split('.').map(s => Buffer.from(s, 'base64url'));
  if (parts.length !== 3 || parts[0].length !== 12 || parts[1].length !== 16) {
    throw new Error('Invalid sealed value');
  }
  const cipher = createDecipheriv('aes-256-gcm', secret, parts[0]);
  cipher.setAuthTag(parts[1]);
  return JSON.parse(Buffer.concat([cipher.update(parts[2]), cipher.final()]).toString()) as T;
}
export function oauthSetup() {
  const redirect = process.env.GOOGLE_ADS_OAUTH_REDIRECT_URI || '';
  let valid = false;
  try {
    const uri = new URL(redirect);
    valid = uri.protocol === 'https:' && uri.pathname === callbackPath &&
      !uri.username && !uri.password && !uri.hash && !uri.search;
  } catch { /* missing or invalid */ }
  const missing = [
    !process.env.GOOGLE_ADS_CLIENT_ID && 'GOOGLE_ADS_CLIENT_ID',
    !process.env.GOOGLE_ADS_CLIENT_SECRET && 'GOOGLE_ADS_CLIENT_SECRET',
    !key() && 'GOOGLE_ADS_OAUTH_ENCRYPTION_KEY',
    !valid && 'GOOGLE_ADS_OAUTH_REDIRECT_URI',
  ].filter((v): v is string => Boolean(v));
  return { ready: !missing.length, missing, redirect };
}
function trustHost(request: Request) {
  const setup = oauthSetup();
  if (!setup.ready || new URL(request.url).origin !== new URL(setup.redirect).origin) {
    throw new Error('OAuth unavailable on this host');
  }
}
type Pending = { nonce: string; verifier: string; actor: string; at: number };
export const deleteCookie = cookieName + '=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0';
export function startAuthorization(request: Request, actor: string): Response {
  trustHost(request);
  const nonce = Buffer.from(randomBytes(32)).toString('base64url');
  const verifier = Buffer.from(randomBytes(48)).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.search = new URLSearchParams({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID!, redirect_uri: oauthSetup().redirect,
    response_type: 'code', scope, access_type: 'offline', prompt: 'consent',
    state: nonce, code_challenge: challenge, code_challenge_method: 'S256',
  }).toString();
  return new Response(null, { status: 302, headers: {
    location: url.toString(), 'cache-control': 'no-store',
    'set-cookie': cookieName + '=' + seal({ nonce, verifier, actor, at: Date.now() }) +
      '; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600',
  } });
}
export function verifyCallback(request: Request, state: string, actor: string) {
  trustHost(request);
  const raw = request.headers.get('cookie')?.split(';').map(x => x.trim())
    .find(x => x.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
  if (!raw || state.length < 30) throw new Error('Missing authorization state');
  const pending = unseal<Pending>(raw);
  const a = Buffer.from(state), b = Buffer.from(pending.nonce);
  if (a.length !== b.length || !timingSafeEqual(a, b) || pending.actor !== actor ||
    Date.now() - pending.at > 600000 || pending.at > Date.now()) {
    throw new Error('Expired or invalid authorization state');
  }
  return pending.verifier;
}
export async function exchangeCode(code: string, verifier: string) {
  const body = new URLSearchParams({
    code, code_verifier: verifier, grant_type: 'authorization_code',
    client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    redirect_uri: oauthSetup().redirect,
  });
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body,
  });
  if (!res.ok) throw new Error('Google token exchange failed');
  const payload = await res.json() as { refresh_token?: string; scope?: string };
  if (!payload.refresh_token || !payload.scope?.split(' ').includes(scope)) {
    throw new Error('Google did not grant offline Google Ads access');
  }
  return payload.refresh_token;
}
export async function storeRefreshToken(token: string, actor: string) {
  await getStore(store).setJSON('primary', {
    version: 1, actor, storedAt: new Date().toISOString(), encrypted: seal(token),
  });
}
export async function readRefreshToken(): Promise<string | null> {
  if (!key()) return null;
  const value = await getStore(store).get('primary', { type: 'json' }) as {
    version: number; encrypted: string;
  } | null;
  if (!value || value.version !== 1) return null;
  return unseal<string>(value.encrypted);
}
export async function disconnectAds() {
  const value = await readRefreshToken();
  if (value) {
    await fetch('https://oauth2.googleapis.com/revoke', {
      method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ token: value }), signal: AbortSignal.timeout(3000),
    }).catch(() => undefined);
  }
  await getStore(store).delete('primary');
}
