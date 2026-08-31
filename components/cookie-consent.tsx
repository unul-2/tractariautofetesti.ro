'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { GoogleAdsTracking } from '@/components/google-ads-tracking';

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
      {consent === 'accepted' ? <GoogleAdsTracking /> : null}
      {visible ? (
        <aside
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-2xl border border-[#d9e1e8] bg-white p-5 text-[#14283f] shadow-[0_18px_60px_rgba(7,24,39,.22)]"
          aria-label="Preferințe cookie"
        >
          <p className="text-sm font-extrabold">
            Confidențialitatea ta contează
          </p>
          <p className="mt-2 text-xs leading-5 text-[#53677d]">
            Folosim strict date tehnice necesare pentru funcționare.
            Cookie-urile de marketing pentru măsurarea reclamelor Google pornesc
            numai dacă le accepți. Poți refuza fără să pierzi accesul la site.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              className="min-h-10 rounded-lg border border-[#cbd6e2] px-4 text-sm font-bold transition hover:bg-[#f2f5f8]"
              type="button"
              onClick={() => save('rejected')}
            >
              Doar necesare
            </button>
            <button
              className="min-h-10 rounded-lg bg-[#f7a71b] px-4 text-sm font-extrabold text-[#071827] transition hover:bg-[#ffc558]"
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
