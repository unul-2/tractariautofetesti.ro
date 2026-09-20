import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { getStore } from '@netlify/blobs';

type AdminUser = {
  email?: string | null;
  id?: string | null;
};

type AttemptState = {
  failures: number;
  windowStartedAt: string;
  lockUntil?: string;
};

type EditSessionPayload = {
  exp: number;
  nonce: string;
  sub: string;
};

export type AdminAuditEvent = {
  storedAt: string;
  actorHash: string;
  action: string;
  details: Record<string, unknown>;
};

const attemptStoreName = 'tractari-admin-ads-security';
const auditStoreName = 'tractari-admin-audit';
const cookieName = 'taf_ads_edit';
const maxFailures = 5;
const lockMinutes = 15;
const sessionMinutes = 15;
const windowMs = lockMinutes * 60 * 1000;

function userSubject(user: AdminUser) {
  const identity = user.email || user.id || 'unknown-admin';
  return createHash('sha256').update(identity.toLowerCase()).digest('hex').slice(0, 32);
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function sessionSecret() {
  return process.env.ADS_EDIT_SESSION_SECRET?.trim() ?? '';
}

function configuredPin() {
  return process.env.ADS_EDIT_PIN?.trim() ?? '';
}

function sign(encodedPayload: string) {
  return createHmac('sha256', sessionSecret()).update(encodedPayload).digest('base64url');
}

function parseCookies(header: string | null) {
  const cookies = new Map<string, string>();
  for (const part of (header ?? '').split(';')) {
    const [rawName, ...rawValue] = part.trim().split('=');
    if (!rawName || !rawValue.length) continue;
    cookies.set(rawName, rawValue.join('='));
  }
  return cookies;
}

export function editSecurityConfigured() {
  return /^\d{4}$/.test(configuredPin()) && sessionSecret().length >= 32;
}

export function writeLayerEnabled() {
  return process.env.GOOGLE_ADS_WRITE_ENABLED === 'true';
}

export async function writeAdminAudit(
  user: AdminUser,
  action: string,
  details: Record<string, unknown> = {},
) {
  const store = getStore(auditStoreName);
  const storedAt = new Date().toISOString();
  const key = `ads/${storedAt.slice(0, 10)}/${storedAt}-${randomUUID()}.json`;
  await store.setJSON(key, {
    storedAt,
    actorHash: userSubject(user),
    action,
    details,
  } satisfies AdminAuditEvent);
}

export async function readAdminAudit(days = 30, limit = 50) {
  const store = getStore(auditStoreName);
  const keys: string[] = [];
  const today = new Date();

  for (let index = 0; index < days; index += 1) {
    const date = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate() - index,
      ),
    );
    const prefix = `ads/${date.toISOString().slice(0, 10)}/`;
    const result = await store.list({ prefix });
    keys.push(...result.blobs.map((blob) => blob.key));
  }

  const selected = keys.sort().reverse().slice(0, limit);
  const events = await Promise.all(
    selected.map(
      (key) =>
        store.get(key, { type: 'json' }) as Promise<AdminAuditEvent | null>,
    ),
  );

  return events
    .filter((event): event is AdminAuditEvent => Boolean(event))
    .sort((left, right) => right.storedAt.localeCompare(left.storedAt));
}

export async function verifyPinAttempt(user: AdminUser, pin: string) {
  const now = Date.now();
  const subject = userSubject(user);
  const store = getStore(attemptStoreName);
  const key = `pin/${subject}.json`;
  const current = (await store.get(key, { type: 'json' })) as AttemptState | null;

  if (!editSecurityConfigured()) {
    return { ok: false as const, reason: 'not_configured' as const };
  }

  const lockUntil = current?.lockUntil ? Date.parse(current.lockUntil) : 0;
  if (lockUntil > now) {
    return {
      ok: false as const,
      reason: 'locked' as const,
      lockUntil: new Date(lockUntil).toISOString(),
    };
  }

  const pinMatches = /^\d{4}$/.test(pin) && safeEqual(pin, configuredPin());
  if (pinMatches) {
    await store.setJSON(key, {
      failures: 0,
      windowStartedAt: new Date(now).toISOString(),
    } satisfies AttemptState);
    await writeAdminAudit(user, 'ads_edit_unlock_success');
    return { ok: true as const };
  }

  const previousWindowStart = current?.windowStartedAt
    ? Date.parse(current.windowStartedAt)
    : 0;
  const withinWindow = previousWindowStart > 0 && now - previousWindowStart < windowMs;
  const failures = (withinWindow ? current?.failures ?? 0 : 0) + 1;
  const next: AttemptState = {
    failures,
    windowStartedAt: withinWindow
      ? current?.windowStartedAt ?? new Date(now).toISOString()
      : new Date(now).toISOString(),
  };

  if (failures >= maxFailures) {
    next.lockUntil = new Date(now + windowMs).toISOString();
  }

  await store.setJSON(key, next);
  await writeAdminAudit(user, 'ads_edit_unlock_failed', {
    failures,
    locked: Boolean(next.lockUntil),
  });

  return next.lockUntil
    ? { ok: false as const, reason: 'locked' as const, lockUntil: next.lockUntil }
    : {
        ok: false as const,
        reason: 'invalid_pin' as const,
        attemptsRemaining: maxFailures - failures,
      };
}

export function createEditSessionCookie(user: AdminUser) {
  if (!editSecurityConfigured()) throw new Error('ADS edit security is not configured');

  const expiresAt = Date.now() + sessionMinutes * 60 * 1000;
  const payload: EditSessionPayload = {
    sub: userSubject(user),
    exp: expiresAt,
    nonce: randomUUID(),
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const token = `${encoded}.${sign(encoded)}`;
  const secure = process.env.NETLIFY === 'true' ? '; Secure' : '';

  return {
    expiresAt: new Date(expiresAt).toISOString(),
    header: `${cookieName}=${token}; Path=/api/admin/google-ads; Max-Age=${sessionMinutes * 60}; HttpOnly; SameSite=Strict${secure}`,
  };
}

export function clearEditSessionCookie() {
  const secure = process.env.NETLIFY === 'true' ? '; Secure' : '';
  return `${cookieName}=; Path=/api/admin/google-ads; Max-Age=0; HttpOnly; SameSite=Strict${secure}`;
}

export function verifyEditSession(request: Request, user: AdminUser) {
  if (!editSecurityConfigured()) return { active: false as const };

  const token = parseCookies(request.headers.get('cookie')).get(cookieName);
  if (!token) return { active: false as const };

  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return { active: false as const };

  const expected = sign(encoded);
  if (!safeEqual(signature, expected)) return { active: false as const };

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8'),
    ) as EditSessionPayload;
    if (payload.sub !== userSubject(user) || payload.exp <= Date.now()) {
      return { active: false as const };
    }

    return {
      active: true as const,
      expiresAt: new Date(payload.exp).toISOString(),
    };
  } catch {
    return { active: false as const };
  }
}
