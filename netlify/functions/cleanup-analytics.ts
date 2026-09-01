import type { Config, Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

function retentionDays() {
  const value = Number(process.env.ANALYTICS_RETENTION_DAYS ?? 90);
  return Number.isInteger(value) ? Math.min(Math.max(value, 30), 365) : 90;
}

export const config: Config = { schedule: '17 3 * * *' };

const handler = async (_request: Request, _context: Context) => {
  const store = getStore('tractari-site-analytics');
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - retentionDays());
  const cutoffDay = cutoff.toISOString().slice(0, 10);
  const result = await store.list({ prefix: 'events/' });
  const obsolete = result.blobs.filter((blob) => blob.key.slice('events/'.length, 'events/'.length + 10) < cutoffDay);
  await Promise.all(obsolete.map((blob) => store.delete(blob.key)));

  return new Response(JSON.stringify({ removed: obsolete.length }), {
    headers: { 'content-type': 'application/json' },
  });
};

export default handler;
