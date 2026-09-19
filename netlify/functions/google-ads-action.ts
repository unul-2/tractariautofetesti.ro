import type { Config, Context } from '@netlify/functions';
import { getUser } from '@netlify/identity';
import {
  verifyEditSession,
  writeAdminAudit,
  writeLayerEnabled,
} from '../lib/admin-ads-security';
import {
  googleAdsConfigState,
  updateCampaignBudget,
  updateCampaignStatus,
} from '../lib/google-ads';

type AdsAction =
  | {
      action: 'campaign_status';
      campaignId: string;
      status: 'ENABLED' | 'PAUSED';
      confirm: 'APPLY';
    }
  | {
      action: 'campaign_budget';
      budgetResourceName: string;
      amountRon: number;
      confirm: 'APPLY';
    };

export const config: Config = {
  method: 'POST',
  path: '/api/admin/google-ads/actions',
};

const handler = async (request: Request, _context: Context) => {
  const user = await getUser();
  if (!user) return new Response('Authentication required', { status: 401 });
  if (!user.roles?.includes('admin')) {
    return new Response('Administrator access required', { status: 403 });
  }

  const elevated = verifyEditSession(request, user);
  if (!elevated.active) {
    return Response.json(
      { ok: false, reason: 'edit_session_required' },
      { status: 403, headers: { 'cache-control': 'no-store' } },
    );
  }

  if (!writeLayerEnabled()) {
    return Response.json(
      { ok: false, reason: 'write_layer_disabled' },
      { status: 503, headers: { 'cache-control': 'no-store' } },
    );
  }

  if (!googleAdsConfigState().configured) {
    return Response.json(
      { ok: false, reason: 'google_ads_not_configured' },
      { status: 503, headers: { 'cache-control': 'no-store' } },
    );
  }

  let body: AdsAction;
  try {
    body = (await request.json()) as AdsAction;
  } catch {
    return Response.json({ ok: false, reason: 'invalid_request' }, { status: 400 });
  }

  if (body.confirm !== 'APPLY') {
    return Response.json(
      { ok: false, reason: 'explicit_confirmation_required' },
      { status: 400 },
    );
  }

  try {
    if (body.action === 'campaign_status') {
      if (!/^\d+$/.test(body.campaignId) || !['ENABLED', 'PAUSED'].includes(body.status)) {
        return Response.json({ ok: false, reason: 'invalid_action' }, { status: 400 });
      }

      await writeAdminAudit(user, 'ads_mutation_requested', {
        action: body.action,
        campaignId: body.campaignId,
        status: body.status,
      });
      await updateCampaignStatus(body.campaignId, body.status);
      await writeAdminAudit(user, 'ads_mutation_succeeded', {
        action: body.action,
        campaignId: body.campaignId,
        status: body.status,
      });

      return Response.json(
        { ok: true },
        { headers: { 'cache-control': 'no-store' } },
      );
    }

    if (body.action === 'campaign_budget') {
      if (
        !/^customers\/\d+\/campaignBudgets\/\d+$/.test(body.budgetResourceName) ||
        !Number.isFinite(body.amountRon) ||
        body.amountRon < 1 ||
        body.amountRon > 10000
      ) {
        return Response.json({ ok: false, reason: 'invalid_action' }, { status: 400 });
      }

      const amountMicros = Math.round(body.amountRon * 1_000_000);
      await writeAdminAudit(user, 'ads_mutation_requested', {
        action: body.action,
        budgetResourceName: body.budgetResourceName,
        amountRon: body.amountRon,
      });
      await updateCampaignBudget(body.budgetResourceName, amountMicros);
      await writeAdminAudit(user, 'ads_mutation_succeeded', {
        action: body.action,
        budgetResourceName: body.budgetResourceName,
        amountRon: body.amountRon,
      });

      return Response.json(
        { ok: true },
        { headers: { 'cache-control': 'no-store' } },
      );
    }

    return Response.json({ ok: false, reason: 'unsupported_action' }, { status: 400 });
  } catch (error) {
    const requestId =
      error && typeof error === 'object' && 'requestId' in error
        ? String(error.requestId)
        : null;

    await writeAdminAudit(user, 'ads_mutation_failed', {
      action: body.action,
      requestId,
    });

    return Response.json(
      {
        ok: false,
        reason: 'google_ads_mutation_failed',
        requestId,
      },
      { status: 502, headers: { 'cache-control': 'no-store' } },
    );
  }
};

export default handler;
