'use client';

import { useEffect } from 'react';

export type SiteEventName =
  | 'page_view'
  | 'call_click'
  | 'whatsapp_click'
  | 'whatsapp_location_click';

const consentKey = 'taf-cookie-consent-v1';
const sessionKey = 'taf-analytics-session-v1';
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
  return Object.fromEntries(
    allowedCampaignKeys.flatMap((key) => {
      const value = params.get(key)?.trim();
      return value ? [[key, value.slice(0, 80)]] : [];
    }),
  );
}

export function trackSiteEvent(name: SiteEventName) {
  if (typeof window === 'undefined' || !hasMarketingConsent()) return;

  const body = JSON.stringify({
    name,
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
  useEffect(() => {
    trackSiteEvent('page_view');
  }, []);

  return null;
}
