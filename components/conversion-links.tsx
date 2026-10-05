'use client';

import type { AnchorHTMLAttributes } from 'react';
import {
  trackSiteEvent,
  type ServiceAnalyticsKey,
} from '@/components/site-analytics';

const phoneNumber = '0723 511 865';
const phoneHref = 'tel:+40723511865';
const whatsappNumber = '40723511865';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function trackConversion(label: string | undefined) {
  if (!label || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'conversion', { send_to: label });
}

type PhoneLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  conversionLabel?: string;
  service?: ServiceAnalyticsKey;
};

export function PhoneLink({
  children,
  conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL,
  service = 'towing',
  onClick,
  ...props
}: PhoneLinkProps) {
  return (
    <a
      {...props}
      href={phoneHref}
      onClick={(event) => {
        trackSiteEvent('call_click', service);
        trackConversion(conversionLabel);
        onClick?.(event);
      }}
    >
      {children ?? phoneNumber}
    </a>
  );
}

type WhatsAppLocationButtonProps = {
  className?: string;
  children: React.ReactNode;
  conversionLabel?: string;
  service?: ServiceAnalyticsKey;
  serviceLabel?: string;
};

export function WhatsAppLocationButton({
  className,
  children,
  conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL,
  service = 'towing',
  serviceLabel,
}: WhatsAppLocationButtonProps) {
  const openWhatsApp = (locationText?: string) => {
    const request = serviceLabel
      ? `Bună ziua! Am nevoie de informații pentru: ${serviceLabel}.`
      : 'Bună ziua! Am nevoie de tractare auto.';

    const message = [
      request,
      locationText ?? 'Îmi pot spune poziția mea după ce vorbim.',
      'Vă rog să-mi confirmați disponibilitatea, timpul estimat și costul.',
    ].join('\n');

    trackSiteEvent(
      locationText ? 'whatsapp_location_click' : 'whatsapp_click',
      service,
    );
    trackConversion(conversionLabel);
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const handleClick = () => {
    if (!navigator.geolocation) {
      openWhatsApp();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const location = `Locația mea: https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;
        openWhatsApp(location);
      },
      () => openWhatsApp(),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    );
  };

  return (
    <button className={className} type="button" onClick={handleClick}>
      {children}
    </button>
  );
}

export { phoneNumber };
