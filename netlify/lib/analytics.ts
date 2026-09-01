import { createHash, randomUUID } from 'node:crypto';
import { getStore } from '@netlify/blobs';

export const eventNames = [
  'page_view',
  'call_click',
  'whatsapp_click',
  'whatsapp_location_click',
] as const;

export type AnalyticsEventName = (typeof eventNames)[number];

export type StoredEvent = {
  campaign: Record<string, string>;
  device: 'desktop' | 'mobile' | 'tablet' | 'other';
  name: AnalyticsEventName;
  path: string;
  sessionHash: string;
  storedAt: string;
};

const storeName = 'tractari-site-analytics';

function utcDay(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function hashSession(value: string) {
  return createHash('sha256').update(value).digest('hex').slice(0, 24);
}

export function deviceFromUserAgent(value: string | null): StoredEvent['device'] {
  const userAgent = value?.toLowerCase() ?? '';
  if (/ipad|tablet|kindle|silk/.test(userAgent)) return 'tablet';
  if (/mobi|android|iphone|ipod/.test(userAgent)) return 'mobile';
  if (userAgent) return 'desktop';
  return 'other';
}

export async function writeEvent(event: StoredEvent) {
  const store = getStore(storeName);
  const key = `events/${utcDay()}/${event.storedAt}-${randomUUID()}.json`;
  await store.setJSON(key, event);
}

export async function readEvents(days: number) {
  const store = getStore(storeName);
  const keys: string[] = [];
  const today = new Date();

  for (let index = 0; index < days; index += 1) {
    const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - index));
    const result = await store.list({ prefix: `events/${utcDay(date)}/` });
    keys.push(...result.blobs.map((blob) => blob.key));
  }

  const events = await Promise.all(
    keys.map((key) => store.get(key, { type: 'json' }) as Promise<StoredEvent | null>),
  );
  return events.filter((event): event is StoredEvent => Boolean(event));
}
