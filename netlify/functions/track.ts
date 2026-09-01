import type { Config, Context } from '@netlify/functions';
import {
  deviceFromUserAgent,
  eventNames,
  hashSession,
  type AnalyticsEventName,
  writeEvent,
} from '../lib/analytics';

const maxBodyLength = 1_500;
const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign'] as const;

function response(status: number, body?: Record<string, string>) {
  return Response.json(body ?? {}, {
    status,
    headers: { 'cache-control': 'no-store' },
  });
}

function safeCampaign(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  return Object.fromEntries(
    campaignKeys.flatMap((key) => {
      const item = (value as Record<string, unknown>)[key];
      return typeof item === 'string' && item.trim()
        ? [[key, item.trim().slice(0, 80)]]
        : [];
    }),
  );
}

function validSession(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{16,96}$/.test(value);
}

function validPath(value: unknown): value is string {
  return typeof value === 'string' && /^\/[a-zA-Z0-9/_-]{0,180}$/.test(value);
}

export const config: Config = {
  method: 'POST',
  path: '/api/measure',
  rateLimit: { aggregateBy: 'ip', windowLimit: 120, windowSize: 60 },
};

const handler = async (request: Request, _context: Context) => {
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) {
    return response(403, { error: 'Invalid origin' });
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (Number.isFinite(contentLength) && contentLength > maxBodyLength) {
    return response(413, { error: 'Payload too large' });
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return response(400, { error: 'Invalid JSON' });
  }

  if (
    !eventNames.includes(payload.name as AnalyticsEventName) ||
    !validSession(payload.sessionId) ||
    !validPath(payload.path)
  ) {
    return response(400, { error: 'Invalid event' });
  }

  await writeEvent({
    campaign: safeCampaign(payload.campaign),
    device: deviceFromUserAgent(request.headers.get('user-agent')),
    name: payload.name as AnalyticsEventName,
    path: payload.path,
    sessionHash: hashSession(payload.sessionId),
    storedAt: new Date().toISOString(),
  });

  return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
};

export default handler;
