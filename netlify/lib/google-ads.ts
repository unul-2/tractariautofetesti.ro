import { createSign } from 'node:crypto';

const defaultApiVersion = 'v25';

type GoogleAdsAuth =
  | {
      kind: 'service-account';
      email: string;
      privateKey: string;
    }
  | {
      kind: 'refresh-token';
      clientId: string;
      clientSecret: string;
      refreshToken: string;
    };

type GoogleAdsConfig = {
  apiVersion: string;
  auth: GoogleAdsAuth;
  customerId: string;
  developerToken?: string;
  loginCustomerId?: string;
};

type SearchRow = {
  campaign?: {
    id?: string;
    name?: string;
    status?: string;
  };
  campaignBudget?: {
    amountMicros?: string;
    resourceName?: string;
  };
  metrics?: {
    averageCpc?: string;
    clicks?: string;
    conversions?: number | string;
    costMicros?: string;
    ctr?: number | string;
    impressions?: string;
    phoneCalls?: string;
    phoneImpressions?: string;
  };
};

type SearchStreamBatch = {
  results?: SearchRow[];
};

export type GoogleAdsCampaignReport = {
  id: string;
  name: string;
  status: string;
  dailyBudgetRon: number;
  budgetResourceName: string | null;
  impressions: number;
  clicks: number;
  ctr: number;
  costRon: number;
  averageCpcRon: number;
  conversions: number;
  phoneCalls: number;
  phoneImpressions: number;
};

function env(name: string) {
  return process.env[name]?.trim() ?? '';
}

function cleanCustomerId(value: string) {
  return value.replace(/-/g, '');
}

export function googleAdsConfigState() {
  const customerId = env('GOOGLE_ADS_CUSTOMER_ID');
  const serviceAccountReady =
    Boolean(env('GOOGLE_ADS_SERVICE_ACCOUNT_EMAIL')) &&
    Boolean(env('GOOGLE_ADS_SERVICE_ACCOUNT_PRIVATE_KEY'));
  const refreshTokenReady =
    Boolean(env('GOOGLE_ADS_CLIENT_ID')) &&
    Boolean(env('GOOGLE_ADS_CLIENT_SECRET')) &&
    Boolean(env('GOOGLE_ADS_REFRESH_TOKEN'));

  const missing: string[] = [];
  if (!customerId) missing.push('GOOGLE_ADS_CUSTOMER_ID');
  if (!serviceAccountReady && !refreshTokenReady) {
    missing.push(
      'GOOGLE_ADS_SERVICE_ACCOUNT_EMAIL + GOOGLE_ADS_SERVICE_ACCOUNT_PRIVATE_KEY',
    );
  }

  return {
    configured: missing.length === 0,
    authMode: serviceAccountReady
      ? ('service-account' as const)
      : refreshTokenReady
        ? ('refresh-token' as const)
        : null,
    missing,
  };
}

function getConfig(): GoogleAdsConfig {
  const state = googleAdsConfigState();
  if (!state.configured || !state.authMode) {
    throw new Error(`Google Ads configuration incomplete: ${state.missing.join(', ')}`);
  }

  const auth: GoogleAdsAuth =
    state.authMode === 'service-account'
      ? {
          kind: 'service-account',
          email: env('GOOGLE_ADS_SERVICE_ACCOUNT_EMAIL'),
          privateKey: env('GOOGLE_ADS_SERVICE_ACCOUNT_PRIVATE_KEY').replace(/\\n/g, '\n'),
        }
      : {
          kind: 'refresh-token',
          clientId: env('GOOGLE_ADS_CLIENT_ID'),
          clientSecret: env('GOOGLE_ADS_CLIENT_SECRET'),
          refreshToken: env('GOOGLE_ADS_REFRESH_TOKEN'),
        };

  return {
    apiVersion: env('GOOGLE_ADS_API_VERSION') || defaultApiVersion,
    auth,
    developerToken: env('GOOGLE_ADS_DEVELOPER_TOKEN') || undefined,
    customerId: cleanCustomerId(env('GOOGLE_ADS_CUSTOMER_ID')),
    loginCustomerId: env('GOOGLE_ADS_LOGIN_CUSTOMER_ID')
      ? cleanCustomerId(env('GOOGLE_ADS_LOGIN_CUSTOMER_ID'))
      : undefined,
  };
}

function base64UrlJson(value: Record<string, unknown>) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

async function getServiceAccountAccessToken(auth: Extract<GoogleAdsAuth, { kind: 'service-account' }>) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlJson({ alg: 'RS256', typ: 'JWT' });
  const claims = base64UrlJson({
    iss: auth.email,
    scope: 'https://www.googleapis.com/auth/adwords',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  });
  const unsigned = `${header}.${claims}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(auth.privateKey, 'base64url');
  const assertion = `${unsigned}.${signature}`;

  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    throw new Error(`Google service-account OAuth failed with status ${response.status}`);
  }

  const payload = (await response.json()) as { access_token?: string };
  if (!payload.access_token) throw new Error('Google OAuth returned no access token');
  return payload.access_token;
}

async function getRefreshTokenAccessToken(auth: Extract<GoogleAdsAuth, { kind: 'refresh-token' }>) {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: auth.clientId,
    client_secret: auth.clientSecret,
    refresh_token: auth.refreshToken,
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    throw new Error(`Google OAuth failed with status ${response.status}`);
  }

  const payload = (await response.json()) as { access_token?: string };
  if (!payload.access_token) throw new Error('Google OAuth returned no access token');
  return payload.access_token;
}

async function getAccessToken(config: GoogleAdsConfig) {
  return config.auth.kind === 'service-account'
    ? getServiceAccountAccessToken(config.auth)
    : getRefreshTokenAccessToken(config.auth);
}

async function googleAdsRequest(
  config: GoogleAdsConfig,
  path: string,
  body: Record<string, unknown>,
) {
  const accessToken = await getAccessToken(config);
  const headers: Record<string, string> = {
    authorization: `Bearer ${accessToken}`,
    'content-type': 'application/json',
  };
  if (config.developerToken) {
    headers['developer-token'] = config.developerToken;
  }
  if (config.loginCustomerId) {
    headers['login-customer-id'] = config.loginCustomerId;
  }

  const response = await fetch(
    `https://googleads.googleapis.com/${config.apiVersion}/customers/${config.customerId}/${path}`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const requestId = response.headers.get('request-id') ?? undefined;
    const message = await response.text();
    const error = new Error(`Google Ads request failed with status ${response.status}`);
    Object.assign(error, { requestId, googleMessage: message.slice(0, 1200) });
    throw error;
  }

  return response.json() as Promise<unknown>;
}

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function reportRange(days: number) {
  const end = new Date();
  const start = new Date();
  start.setUTCDate(end.getUTCDate() - (days - 1));
  return { start: dateOnly(start), end: dateOnly(end) };
}

function microsToRon(value: string | number | undefined) {
  return Number(value ?? 0) / 1_000_000;
}

export async function readGoogleAdsReport(days: number) {
  const config = getConfig();
  const range = reportRange(days);
  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign_budget.resource_name,
      campaign_budget.amount_micros,
      metrics.impressions,
      metrics.clicks,
      metrics.ctr,
      metrics.cost_micros,
      metrics.average_cpc,
      metrics.conversions,
      metrics.phone_calls,
      metrics.phone_impressions
    FROM campaign
    WHERE segments.date BETWEEN '${range.start}' AND '${range.end}'
      AND campaign.status != 'REMOVED'
    ORDER BY metrics.cost_micros DESC
  `;

  const raw = (await googleAdsRequest(config, 'googleAds:searchStream', {
    query,
  })) as SearchStreamBatch[];

  const campaigns = raw
    .flatMap((batch) => batch.results ?? [])
    .map((row): GoogleAdsCampaignReport => {
      const metrics = row.metrics ?? {};
      return {
        id: String(row.campaign?.id ?? ''),
        name: row.campaign?.name ?? 'Campanie fără nume',
        status: row.campaign?.status ?? 'UNKNOWN',
        dailyBudgetRon: microsToRon(row.campaignBudget?.amountMicros),
        budgetResourceName: row.campaignBudget?.resourceName ?? null,
        impressions: Number(metrics.impressions ?? 0),
        clicks: Number(metrics.clicks ?? 0),
        ctr: Number(metrics.ctr ?? 0) * 100,
        costRon: microsToRon(metrics.costMicros),
        averageCpcRon: microsToRon(metrics.averageCpc),
        conversions: Number(metrics.conversions ?? 0),
        phoneCalls: Number(metrics.phoneCalls ?? 0),
        phoneImpressions: Number(metrics.phoneImpressions ?? 0),
      };
    });

  const summary = campaigns.reduce(
    (total, campaign) => {
      total.impressions += campaign.impressions;
      total.clicks += campaign.clicks;
      total.costRon += campaign.costRon;
      total.conversions += campaign.conversions;
      total.phoneCalls += campaign.phoneCalls;
      total.phoneImpressions += campaign.phoneImpressions;
      return total;
    },
    {
      impressions: 0,
      clicks: 0,
      costRon: 0,
      conversions: 0,
      phoneCalls: 0,
      phoneImpressions: 0,
    },
  );

  return {
    days,
    range,
    customer: config.customerId.slice(-4).padStart(config.customerId.length, '•'),
    summary: {
      ...summary,
      ctr: summary.impressions ? (summary.clicks / summary.impressions) * 100 : 0,
      averageCpcRon: summary.clicks ? summary.costRon / summary.clicks : 0,
      costPerConversionRon: summary.conversions
        ? summary.costRon / summary.conversions
        : 0,
    },
    campaigns,
  };
}

export async function updateCampaignStatus(campaignId: string, status: 'ENABLED' | 'PAUSED') {
  const config = getConfig();
  return googleAdsRequest(config, 'campaigns:mutate', {
    operations: [
      {
        update: {
          resourceName: `customers/${config.customerId}/campaigns/${campaignId}`,
          status,
        },
        updateMask: 'status',
      },
    ],
  });
}

export async function updateCampaignBudget(
  budgetResourceName: string,
  amountMicros: number,
) {
  const config = getConfig();
  return googleAdsRequest(config, 'campaignBudgets:mutate', {
    operations: [
      {
        update: {
          resourceName: budgetResourceName,
          amountMicros: String(amountMicros),
        },
        updateMask: 'amountMicros',
      },
    ],
  });
}
