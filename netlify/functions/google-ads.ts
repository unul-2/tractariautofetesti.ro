import type { Config, Context } from '@netlify/functions';
import { getUser } from '@netlify/identity';
import {
  editSecurityConfigured,
  verifyEditSession,
  writeLayerEnabled,
} from '../lib/admin-ads-security';
import { googleAdsConfigState, readGoogleAdsReport } from '../lib/google-ads';

export const config: Config = { method: 'GET', path: '/api/admin/google-ads' };

const noStore = { 'cache-control': 'no-store' };

const handler = async (request: Request, _context: Context) => {
  const user = await getUser();
  if (!user) return new Response('Authentication required', { status: 401 });
  if (!user.roles?.includes('admin')) {
    return new Response('Administrator access required', { status: 403 });
  }

  const requestedDays = Number(new URL(request.url).searchParams.get('days') ?? 14);
  const days = Number.isInteger(requestedDays)
    ? Math.min(Math.max(requestedDays, 1), 30)
    : 14;

  const configState = googleAdsConfigState();
  const editSession = verifyEditSession(request, user);

  if (!configState.configured) {
    return Response.json(
      {
        connected: false,
        days,
        missingConfiguration: configState.missing,
        edit: {
          securityConfigured: editSecurityConfigured(),
          writeEnabled: writeLayerEnabled(),
          active: editSession.active,
          expiresAt: editSession.active ? editSession.expiresAt : null,
        },
        report: null,
      },
      { headers: noStore },
    );
  }

  try {
    const report = await readGoogleAdsReport(days);
    return Response.json(
      {
        connected: true,
        days,
        missingConfiguration: [],
        edit: {
          securityConfigured: editSecurityConfigured(),
          writeEnabled: writeLayerEnabled(),
          active: editSession.active,
          expiresAt: editSession.active ? editSession.expiresAt : null,
        },
        report,
      },
      { headers: noStore },
    );
  } catch (error) {
    const requestId =
      error && typeof error === 'object' && 'requestId' in error
        ? String(error.requestId)
        : null;

    return Response.json(
      {
        connected: false,
        days,
        missingConfiguration: [],
        connectionError: 'Google Ads API nu a putut fi interogat.',
        requestId,
        edit: {
          securityConfigured: editSecurityConfigured(),
          writeEnabled: writeLayerEnabled(),
          active: editSession.active,
          expiresAt: editSession.active ? editSession.expiresAt : null,
        },
        report: null,
      },
      { status: 502, headers: noStore },
    );
  }
};

export default handler;
