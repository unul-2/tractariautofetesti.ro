'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { GoogleAdsTracking } from '@/components/google-ads-tracking';
import { SiteAnalytics } from '@/components/site-analytics';

type Consent = 'accepted' | 'rejected' | null;
type Language = 'ro' | 'en';

const storageKey = 'taf-cookie-consent-v1';
const languageStorageKey = 'taf-language-v1';

const copy = {
  ro: {
    label: 'Preferințe cookies',
    title: 'Preferințe cookies',
    body:
      'Folosim cookie-uri strict necesare pentru funcționarea site-ului. Cu acordul tău, activăm și măsurarea agregată a interacțiunilor și tagul Google Ads, pentru a înțelege ce funcționează pe site. Poți continua și doar cu cele necesare.',
    necessary: 'Doar necesare',
    accept: 'Acceptă toate',
  },
  en: {
    label: 'Cookie preferences',
    title: 'Cookie preferences',
    body:
      'We use strictly necessary cookies to keep the website working. With your permission, we also enable aggregated interaction measurement and the Google Ads tag so we can understand what works on the site. You can continue with necessary cookies only.',
    necessary: 'Necessary only',
    accept: 'Accept all',
  },
} as const;

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
  const [language, setLanguage] = useState<Language>('ro');
  const t = copy[language];

  useEffect(() => {
    const initialConsentTimer = window.setTimeout(() => {
      const savedConsent = window.localStorage.getItem(storageKey) as Consent;
      const savedLanguage = window.localStorage.getItem(languageStorageKey);
      if (savedLanguage === 'ro' || savedLanguage === 'en') {
        setLanguage(savedLanguage);
      }
      setConsent(
        savedConsent === 'accepted' || savedConsent === 'rejected'
          ? savedConsent
          : null,
      );
      setVisible(!savedConsent);
    }, 0);

    const openPreferences = () => setVisible(true);
    const languageChange = (event: Event) => {
      const next = (event as CustomEvent<Language>).detail;
      if (next === 'ro' || next === 'en') setLanguage(next);
    };

    window.addEventListener('open-cookie-preferences', openPreferences);
    window.addEventListener('taf-language-change', languageChange);
    return () => {
      window.clearTimeout(initialConsentTimer);
      window.removeEventListener('open-cookie-preferences', openPreferences);
      window.removeEventListener('taf-language-change', languageChange);
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
          aria-label={t.label}
        >
          <p className="text-sm font-extrabold">{t.title}</p>
          <p className="mt-2 text-xs leading-5 text-white/62">{t.body}</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              className="min-h-11 rounded-xl border border-white/14 bg-white/[.05] px-4 text-sm font-bold text-white transition hover:bg-white/[.1]"
              type="button"
              onClick={() => save('rejected')}
            >
              {t.necessary}
            </button>
            <button
              className="min-h-11 rounded-xl bg-[#f6a817] px-4 text-sm font-black text-[#071827] transition hover:bg-[#ffc451]"
              type="button"
              onClick={() => save('accepted')}
            >
              {t.accept}
            </button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
