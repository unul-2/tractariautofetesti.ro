'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export type SiteEventName =
  | 'page_view'
  | 'call_click'
  | 'whatsapp_click'
  | 'whatsapp_location_click';

export type ServiceAnalyticsKey =
  | 'towing'
  | 'mobile-service'
  | 'obd'
  | 'vehicle-transport'
  | 'equipment-transport';

const consentKey = 'taf-cookie-consent-v1';
const sessionKey = 'taf-analytics-session-v1';
const campaignSessionKey = 'taf-campaign-attribution-v2';
const allowedCampaignKeys = ['utm_source', 'utm_medium', 'utm_campaign'] as const;

function hasMarketingConsent() {
  return window.localStorage.getItem(consentKey) === 'accepted';
}

function createSessionId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();

  const values = new Uint32Array(4);
  window.crypto?.getRandomValues?.(values);
  return Array.from(values, (value) => value.toString(36)).join('');
}

function getSessionId() {
  const existing = window.sessionStorage.getItem(sessionKey);
  if (existing) return existing;

  const sessionId = createSessionId();
  window.sessionStorage.setItem(sessionKey, sessionId);
  return sessionId;
}

function campaignContext() {
  const params = new URLSearchParams(window.location.search);
  const current = Object.fromEntries(
    allowedCampaignKeys.flatMap((key) => {
      const value = params.get(key)?.trim();
      return value ? [[key, value.slice(0, 80)]] : [];
    }),
  ) as Record<(typeof allowedCampaignKeys)[number], string>;
  // Do not store or transmit the raw Google click identifier.
  const googleAdsClick = ['gclid', 'gbraid', 'wbraid'].some((key) => params.has(key));
  if (googleAdsClick) {
    current.utm_source ||= 'google';
    current.utm_medium ||= 'cpc';
  }
  if (Object.keys(current).length) {
    window.sessionStorage.setItem(campaignSessionKey, JSON.stringify(current));
    return current;
  }
  try {
    const stored = window.sessionStorage.getItem(campaignSessionKey);
    if (!stored) return {};
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      allowedCampaignKeys.flatMap((key) => {
        const value = (parsed as Record<string, unknown>)[key];
        return typeof value === 'string' && value.length <= 80 ? [[key, value]] : [];
      }),
    );
  } catch { return {}; }
}

export function trackSiteEvent(name: SiteEventName, service?: ServiceAnalyticsKey) {
  if (typeof window === 'undefined' || !hasMarketingConsent()) return;

  const body = JSON.stringify({
    name,
    service,
    sessionId: getSessionId(),
    path: window.location.pathname,
    campaign: campaignContext(),
  });

  void fetch('/api/measure', {
    method: 'POST',
    credentials: 'same-origin',
    keepalive: true,
    headers: { 'content-type': 'application/json' },
    body,
  }).catch(() => {
    // Measurement must never interfere with an urgent call or WhatsApp action.
  });
}

export function SiteAnalytics() {
  const pathname = usePathname();
  useEffect(() => {
    trackSiteEvent('page_view');
  }, [pathname]);

  return null;
}
