'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CarFront,
  Languages,
  MapPin,
  MessageCircle,
  Phone,
  ScanLine,
  ShieldCheck,
  Tractor,
  Wrench,
} from 'lucide-react';
import { PhoneLink, WhatsAppLocationButton, phoneNumber } from '@/components/conversion-links';
import { getService, serviceCatalog, type Language, type ServiceKey } from '@/lib/services';

const languageStorageKey = 'taf-language-v1';

const icons: Record<ServiceKey, typeof Wrench> = {
  'mobile-service': Wrench,
  obd: ScanLine,
  'vehicle-transport': CarFront,
  'equipment-transport': Tractor,
};

export function ServiceLanding({ serviceKey }: { serviceKey: ServiceKey }) {
  const [language, setLanguage] = useState<Language>('ro');
  const service = serviceCatalog[serviceKey];
  const content = getService(serviceKey, language);
  const Icon = icons[serviceKey];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(languageStorageKey);
      if (saved === 'ro' || saved === 'en') {
        setLanguage(saved);
        document.documentElement.setAttribute('lang', saved);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const switchLanguage = (next: Language) => {
    setLanguage(next);
    window.localStorage.setItem(languageStorageKey, next);
    document.documentElement.setAttribute('lang', next);
    window.dispatchEvent(new CustomEvent('taf-language-change', { detail: next }));
  };

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-[#102235]">
      <section className="relative isolate overflow-hidden bg-[#061522] text-white">
        <div className="absolute inset-0 hero-grid opacity-35" aria-hidden="true" />
        <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-[#f6a817]/14 blur-3xl" aria-hidden="true" />

        <header className="relative z-20 mx-auto max-w-7xl px-4 pt-4 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between rounded-2xl border border-white/12 bg-[#071827]/78 px-3 py-3 shadow-2xl shadow-black/15 backdrop-blur-xl sm:px-4">
            <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Tractări Auto Fetești">
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#071827]">
                <Image src="/tractari-auto-fetesti-logo.webp" alt="" fill sizes="48px" className="object-cover" />
              </span>
              <span className="hidden leading-tight sm:block">
                <span className="block text-sm font-black">Tractări Auto Fetești</span>
                <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[.14em] text-white/50">
                  {language === 'ro' ? 'Servicii auto & transport' : 'Vehicle services & transport'}
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center rounded-xl border border-white/12 bg-white/[.06] p-1">
                <Languages className="ml-1 hidden h-4 w-4 text-white/55 sm:block" aria-hidden="true" />
                {(['ro', 'en'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => switchLanguage(item)}
                    aria-pressed={language === item}
                    className={`min-h-9 rounded-lg px-2.5 text-[11px] font-black uppercase tracking-[.08em] transition ${
                      language === item ? 'bg-[#f6a817] text-[#071827]' : 'text-white/62 hover:text-white'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <PhoneLink
                service={service.analyticsKey}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-3.5 text-sm font-black text-[#071827] transition hover:bg-[#ffd36f]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{language === 'ro' ? 'Sună' : 'Call'}</span>
              </PhoneLink>
            </div>
          </div>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[1fr_.72fr] lg:items-end lg:px-10 lg:pb-28 lg:pt-24">
          <div>
            <Link href="/#servicii" className="inline-flex items-center gap-2 text-sm font-bold text-white/62 transition hover:text-[#ffd36f]">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {language === 'ro' ? 'Înapoi la toate serviciile' : 'Back to all services'}
            </Link>
            <p className="mt-8 text-xs font-black uppercase tracking-[.14em] text-[#ffd36f]">{content.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[.98] tracking-[-.055em] text-balance sm:text-6xl lg:text-7xl">
              {content.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
              {content.intro}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PhoneLink
                service={service.analyticsKey}
                className="group inline-flex min-h-15 items-center justify-center gap-3 rounded-2xl bg-[#f6a817] px-6 text-base font-black text-[#071827] transition hover:bg-[#ffc451]"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                {content.cta}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </PhoneLink>
              <WhatsAppLocationButton
                service={service.analyticsKey}
                serviceLabel={content.shortTitle}
                className="inline-flex min-h-15 items-center justify-center gap-3 rounded-2xl border border-white/18 bg-white/[.06] px-6 text-base font-black text-white transition hover:bg-white/[.1]"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                WhatsApp + {language === 'ro' ? 'locație' : 'location'}
              </WhatsAppLocationButton>
            </div>
          </div>

          <aside className="rounded-[1.8rem] border border-white/12 bg-white/[.055] p-6 backdrop-blur-xl sm:p-7">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#f6a817] text-[#071827]">
              <Icon className="h-7 w-7" aria-hidden="true" />
            </span>
            <p className="mt-6 text-sm leading-6 text-white/64">{content.summary}</p>
            <div className="mt-6 grid gap-3 border-t border-white/10 pt-6 text-sm text-white/72">
              <span className="inline-flex items-center gap-3">
                <BadgeCheck className="h-4 w-4 text-[#ffd36f]" aria-hidden="true" />
                {language === 'ro' ? 'Disponibilitate confirmată înainte de plecare' : 'Availability confirmed before departure'}
              </span>
              <span className="inline-flex items-center gap-3">
                <MapPin className="h-4 w-4 text-[#ffd36f]" aria-hidden="true" />
                {language === 'ro' ? 'Fetești + zona confirmată telefonic' : 'Fetești + area confirmed by phone'}
              </span>
              <span className="inline-flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-[#ffd36f]" aria-hidden="true" />
                {language === 'ro' ? 'Cost discutat înainte de intervenție' : 'Cost discussed before the job'}
              </span>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-18 sm:py-22 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:px-8 lg:grid-cols-2 lg:px-10">
          <article className="rounded-[1.7rem] border border-[#d8e0e7] bg-white p-7 shadow-[0_14px_42px_rgba(13,34,52,.05)] sm:p-8">
            <p className="section-kicker">{content.situationsTitle}</p>
            <ul className="mt-6 grid gap-4">
              {content.situations.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-[#52677b]">
                  <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-[#a46600]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[1.7rem] border border-[#d8e0e7] bg-white p-7 shadow-[0_14px_42px_rgba(13,34,52,.05)] sm:p-8">
            <p className="section-kicker">{content.includesTitle}</p>
            <ul className="mt-6 grid gap-4">
              {content.includes.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-[#52677b]">
                  <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-[#a46600]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="pb-20 sm:pb-24 lg:pb-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-6 overflow-hidden rounded-[2rem] bg-[#0b2235] p-7 text-white sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center lg:p-11">
            <div>
              <p className="text-xs font-black uppercase tracking-[.14em] text-[#ffd36f]">{content.noteTitle}</p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68 sm:text-base">{content.note}</p>
            </div>
            <PhoneLink
              service={service.analyticsKey}
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#f6a817] px-5 text-sm font-black text-[#071827] transition hover:bg-[#ffc451]"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              {phoneNumber}
            </PhoneLink>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#dce3e9] bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 text-sm text-[#607183] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <span>© {new Date().getFullYear()} Tractări Auto Fetești</span>
          <Link href="/" className="font-black text-[#193851] hover:text-[#a46600]">
            {language === 'ro' ? 'Pagina principală' : 'Home'}
          </Link>
        </div>
      </footer>
    </main>
  );
}
