'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { GoogleAdsTracking } from '@/components/google-ads-tracking';
import { SiteAnalytics } from '@/components/site-analytics';

type Consent = 'accepted' | 'rejected' | null;

const storageKey = 'taf-cookie-consent-v1';

export function CookiePreferencesButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      className={className}
      type="button"
      onClick={() => window.dispatchEvent(new Event('open-cookie-preferences'))}
    >
      {children}
    </button>
  );
}

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const initialConsentTimer = window.setTimeout(() => {
      const savedConsent = window.localStorage.getItem(storageKey) as Consent;
      setConsent(
        savedConsent === 'accepted' || savedConsent === 'rejected'
          ? savedConsent
          : null,
      );
      setVisible(!savedConsent);
    }, 0);

    const openPreferences = () => setVisible(true);
    window.addEventListener('open-cookie-preferences', openPreferences);
    return () => {
      window.clearTimeout(initialConsentTimer);
      window.removeEventListener('open-cookie-preferences', openPreferences);
    };
  }, []);

  const save = (choice: Exclude<Consent, null>) => {
    window.localStorage.setItem(storageKey, choice);
    setConsent(choice);
    setVisible(false);

    if (choice === 'rejected' && window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
      });
      window.location.reload();
    }
  };

  return (
    <>
      {consent === 'accepted' ? (
        <>
          <GoogleAdsTracking />
          <SiteAnalytics />
        </>
      ) : null}
      {visible ? (
        <aside
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-[1.4rem] border border-white/10 bg-[#071827]/95 p-5 text-white shadow-[0_22px_70px_rgba(7,24,39,.4)] backdrop-blur-xl"
          aria-label="Preferințe cookie"
        >
          <p className="text-sm font-extrabold">
            Confidențialitatea ta contează
          </p>
          <p className="mt-2 text-xs leading-5 text-white/62">
            Folosim strict date tehnice necesare pentru funcționare.
            Cookie-urile de marketing și măsurarea agregată a butoanelor de apel
            sau WhatsApp pornesc numai dacă le accepți. Poți refuza fără să pierzi
            accesul la site.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              className="min-h-11 rounded-xl border border-white/14 bg-white/[.05] px-4 text-sm font-bold text-white transition hover:bg-white/[.1]"
              type="button"
              onClick={() => save('rejected')}
            >
              Doar necesare
            </button>
            <button
              className="min-h-11 rounded-xl bg-[#f6a817] px-4 text-sm font-black text-[#071827] transition hover:bg-[#ffc451]"
              type="button"
              onClick={() => save('accepted')}
            >
              Accept marketing
            </button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
