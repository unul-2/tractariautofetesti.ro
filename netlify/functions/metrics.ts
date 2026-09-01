import type { Config, Context } from '@netlify/functions';
import { getUser } from '@netlify/identity';
import { readEvents, type StoredEvent } from '../lib/analytics';

type Count = { label: string; value: number };

function countBy(events: StoredEvent[], getLabel: (event: StoredEvent) => string): Count[] {
  const counts = new Map<string, number>();
  for (const event of events) {
    const label = getLabel(event);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, 'ro'));
}

function daily(events: StoredEvent[], days: number) {
  const values = new Map<string, { day: string; pageViews: number; callClicks: number; whatsappClicks: number }>();
  const today = new Date();
  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - index));
    const day = date.toISOString().slice(0, 10);
    values.set(day, { day, pageViews: 0, callClicks: 0, whatsappClicks: 0 });
  }
  for (const event of events) {
    const value = values.get(event.storedAt.slice(0, 10));
    if (!value) continue;
    if (event.name === 'page_view') value.pageViews += 1;
    if (event.name === 'call_click') value.callClicks += 1;
    if (event.name === 'whatsapp_click' || event.name === 'whatsapp_location_click') value.whatsappClicks += 1;
  }
  return [...values.values()];
}

export const config: Config = { method: 'GET', path: '/api/admin/metrics' };

const handler = async (request: Request, _context: Context) => {
  const user = await getUser();
  if (!user) return new Response('Authentication required', { status: 401 });
  if (!user.roles?.includes('admin')) return new Response('Administrator access required', { status: 403 });

  const requestedDays = Number(new URL(request.url).searchParams.get('days') ?? 14);
  const days = Number.isInteger(requestedDays) ? Math.min(Math.max(requestedDays, 1), 31) : 14;
  const events = await readEvents(days);
  const uniqueSessions = new Set(events.map((event) => event.sessionHash));
  const sessionsWithCall = new Set(
    events.filter((event) => event.name === 'call_click').map((event) => event.sessionHash),
  );
  const pageViews = events.filter((event) => event.name === 'page_view').length;
  const callClicks = events.filter((event) => event.name === 'call_click').length;
  const whatsappClicks = events.filter(
    (event) => event.name === 'whatsapp_click' || event.name === 'whatsapp_location_click',
  ).length;
  const whatsappLocationClicks = events.filter((event) => event.name === 'whatsapp_location_click').length;

  return Response.json(
    {
      days,
      summary: {
        sessions: uniqueSessions.size,
        pageViews,
        callClicks,
        whatsappClicks,
        whatsappLocationClicks,
        callClickRate: uniqueSessions.size ? Math.round((sessionsWithCall.size / uniqueSessions.size) * 1000) / 10 : 0,
      },
      daily: daily(events, days),
      devices: countBy(events, (event) => event.device),
      sources: countBy(events, (event) => event.campaign.utm_source || 'Direct / necunoscut'),
    },
    { headers: { 'cache-control': 'no-store' } },
  );
};

export default handler;
