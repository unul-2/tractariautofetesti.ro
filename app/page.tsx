'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Languages,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Truck,
  Wrench,
} from 'lucide-react';
import {
  PhoneLink,
  phoneNumber,
  WhatsAppLocationButton,
} from '@/components/conversion-links';
import { GoogleReviews } from '@/components/google-reviews';

type Language = 'ro' | 'en';

const languageStorageKey = 'taf-language-v1';

const copy = {
  ro: {
    nav: {
      services: 'Servicii',
      coverage: 'Acoperire',
      reviews: 'Recenzii',
      contact: 'Contact',
      call: 'Sună',
    },
    brandSubline: '24/7 · A2 · Ialomița',
    availability: 'Intervenții 24/7',
    verifiedReviews: 'Recenzii Google verificate',
    heroLine1: 'Tractări auto Fetești.',
    heroLine2: 'Ai rămas pe drum?',
    heroLine3: 'Ajutor direct, fără complicații.',
    heroCopy:
      'Pornim din Fetești și intervenim în mod uzual pe o rază de aproximativ 40–50 km, inclusiv în zona A2. Pentru mai departe, confirmăm la telefon înainte de plecare.',
    callNow: 'Sună acum',
    whatsappLocation: 'WhatsApp + locație',
    safePickup: 'Fără formulare',
    timeAndCost: 'Cost confirmat înainte de plecare',
    quickIntervention: 'Zonă reală de intervenție',
    tellUs3: 'Fetești → A2 → ~40–50 km',
    heroSteps: [
      ['01', 'Fetești', 'Punctul nostru de plecare.'],
      ['02', '≈ 40–50 km', 'Zona uzuală de intervenție.'],
      ['03', 'Mai departe', 'Confirmăm telefonic înainte de plecare.'],
    ],
    noInventedPrices:
      'Pentru distanțe mai mari decât zona uzuală, discutăm cazul la telefon și confirmăm dacă putem prelua intervenția.',
    proof: [
      ['Fetești', 'Punct de plecare'],
      ['~50 km', 'Zona uzuală'],
      ['24/7', 'Disponibilitate'],
    ],
    servicesKicker: 'Servicii',
    servicesTitle: 'Exact ce ai nevoie când mașina nu mai merge.',
    servicesCopy:
      'Fără meniuri complicate și fără formulare lungi. Ne dai informația esențială, stabilim ce poate fi făcut și confirmăm intervenția.',
    confirmByPhone: 'Intervenție adaptată situației',
    services: [
      {
        number: '01',
        icon: Truck,
        title: 'Tractări auto',
        text: 'Preluare sigură pentru autoturisme care nu mai pot circula și transport către destinația stabilită.',
      },
      {
        number: '02',
        icon: Navigation,
        title: 'Preluare de pe A2',
        text: 'Intervenții pentru zona Fetești și sectoarele apropiate de pe Autostrada Soarelui.',
      },
      {
        number: '03',
        icon: Wrench,
        title: 'Asistență rutieră',
        text: 'Descrii problema la telefon, iar noi stabilim rapid ce tip de intervenție este potrivit.',
      },
      {
        number: '04',
        icon: MapPin,
        title: 'Transport auto',
        text: 'Transport organizat către service, domiciliu sau altă destinație confirmată împreună.',
      },
    ],
    howKicker: 'Cum procedăm',
    howTitle: 'De la problemă la soluție, fără zgomot inutil.',
    howCopy:
      'Într-o situație de urgență, pagina trebuie să te ajute să iei o decizie rapidă. Restul îl clarificăm direct.',
    howSteps: [
      ['01', 'Ne contactezi', 'Suni sau trimiți un mesaj cu locația și situația mașinii.', Phone],
      ['02', 'Confirmăm', 'Îți spunem disponibilitatea, timpul estimat și costul pentru cazul tău.', BadgeCheck],
      ['03', 'Preluăm', 'Stabilim destinația și organizăm transportul în condiții de siguranță.', Truck],
    ],
    coverageKicker: 'Acoperire',
    coverageTitle: 'Punct de plecare: Fetești.',
    coverageCopy:
      'Zona uzuală de intervenție este de aproximativ 40–50 km în jurul Feteștiului. Pentru distanțe mai mari, verificăm disponibilitatea înainte de plecare.',
    checkAvailability: 'Verifică disponibilitatea',
    interventionArea: 'Zona de intervenție',
    coverage: [
      'Fetești',
      'A2 în zona Fetești',
      '≈ 40–50 km în jur',
      'Mai departe: confirmare telefonică',
    ],
    startingPoint: 'Punct de pornire',
    openMaps: 'Deschide în Google Maps',
    needHelp: 'Ai nevoie de ajutor acum?',
    shortCall: 'Un apel scurt poate clarifica tot.',
    contactCopy:
      'Spune-ne locația, mașina și destinația. Îți confirmăm direct dacă putem prelua intervenția.',
    faqKicker: 'Întrebări frecvente',
    faqTitle: 'Informația esențială, înainte să ne contactezi.',
    faqs: [
      {
        question: 'Ce trebuie să vă spun când sun?',
        answer:
          'Locația cât mai exactă, tipul mașinii, situația pe scurt și destinația dorită. Confirmăm înainte de plecare disponibilitatea, timpul estimat și costul.',
      },
      {
        question: 'Pot trimite locația pe WhatsApp?',
        answer:
          'Da. Butonul WhatsApp cere acordul pentru locație doar când îl apeși. Dacă nu permiți accesul, poți continua conversația fără locație automată.',
      },
      {
        question: 'Preluați mașini și de pe A2?',
        answer:
          'Da, în zona Fetești și în aria în care putem interveni în siguranță. Pentru poziția exactă, sună și confirmăm imediat disponibilitatea.',
      },
      {
        question: 'Cât de departe vă deplasați?',
        answer:
          'În mod obișnuit intervenim la aproximativ 40–50 km în jurul Feteștiului. Pentru distanțe mai mari putem discuta cazul la telefon și confirma dacă îl putem prelua.',
      },
      {
        question: 'Cum aflu costul?',
        answer:
          'Costul depinde de poziție, tipul vehiculului și destinație. Îl discutăm clar la telefon, înainte să plecăm către tine.',
      },
    ],
    footerCopy:
      'Tractare și asistență rutieră cu punct de plecare din Fetești, pentru A2 și aproximativ 40–50 km în jur. Distanțele mai mari se confirmă telefonic.',
    navigation: 'Navigare',
    contactLegal: 'Contact & legal',
    privacy: 'Confidențialitate',
    terms: 'Termeni',
    rights: 'Toate drepturile rezervate.',
    footerCoverage: 'Fetești · A2 · ~40–50 km · mai departe la telefon',
    mobileCall: 'Sună acum',
  },
  en: {
    nav: {
      services: 'Services',
      coverage: 'Coverage',
      reviews: 'Reviews',
      contact: 'Contact',
      call: 'Call',
    },
    brandSubline: '24/7 · A2 · Ialomița',
    availability: '24/7 roadside response',
    verifiedReviews: 'Verified Google reviews',
    heroLine1: 'Vehicle recovery Fetești.',
    heroLine2: 'Stranded on the road?',
    heroLine3: 'Straightforward roadside help.',
    heroCopy:
      'We start from Fetești and normally cover approximately 40–50 km, including the nearby A2 area. For longer distances, call first and we will confirm before departure.',
    callNow: 'Call now',
    whatsappLocation: 'WhatsApp + location',
    safePickup: 'No forms',
    timeAndCost: 'Cost confirmed before departure',
    quickIntervention: 'Real service area',
    tellUs3: 'Fetești → A2 → ~40–50 km',
    heroSteps: [
      ['01', 'Fetești', 'Our starting point.'],
      ['02', '≈ 40–50 km', 'Our usual service area.'],
      ['03', 'Further away', 'Call first and we confirm before departure.'],
    ],
    noInventedPrices:
      'For distances beyond our usual area, call us first and we will confirm whether we can take the job.',
    proof: [
      ['Fetești', 'Starting point'],
      ['~50 km', 'Usual area'],
      ['24/7', 'Availability'],
    ],
    servicesKicker: 'Services',
    servicesTitle: 'The roadside help you need when the car stops.',
    servicesCopy:
      'No complicated menus and no long forms. Give us the essential details, we assess the situation and confirm the intervention.',
    confirmByPhone: 'Case-specific service',
    services: [
      {
        number: '01',
        icon: Truck,
        title: 'Vehicle recovery',
        text: 'Safe recovery for vehicles that can no longer be driven and transport to the agreed destination.',
      },
      {
        number: '02',
        icon: Navigation,
        title: 'A2 recovery',
        text: 'Roadside recovery around Fetești and nearby sections of the A2 motorway.',
      },
      {
        number: '03',
        icon: Wrench,
        title: 'Roadside assistance',
        text: 'Describe the problem by phone and we will quickly determine the appropriate intervention.',
      },
      {
        number: '04',
        icon: MapPin,
        title: 'Vehicle transport',
        text: 'Transport to a garage, home address or another destination agreed with you.',
      },
    ],
    howKicker: 'How it works',
    howTitle: 'From problem to solution, without unnecessary friction.',
    howCopy:
      'In a roadside emergency, the page should help you act quickly. We clarify the rest directly by phone.',
    howSteps: [
      ['01', 'Contact us', 'Call or message us with your location and the vehicle situation.', Phone],
      ['02', 'We confirm', 'We confirm availability, estimated timing and cost for your case.', BadgeCheck],
      ['03', 'We recover', 'We agree the destination and organise safe vehicle transport.', Truck],
    ],
    coverageKicker: 'Coverage',
    coverageTitle: 'Starting point: Fetești.',
    coverageCopy:
      'Our usual service area is approximately 40–50 km around Fetești. For longer distances, we confirm availability before departure.',
    checkAvailability: 'Check availability',
    interventionArea: 'Service area',
    coverage: [
      'Fetești',
      'A2 around Fetești',
      '≈ 40–50 km radius',
      'Further away: call first',
    ],
    startingPoint: 'Starting point',
    openMaps: 'Open in Google Maps',
    needHelp: 'Need help now?',
    shortCall: 'A short call can clarify everything.',
    contactCopy:
      'Tell us your location, vehicle and destination. We will confirm directly whether we can take the job.',
    faqKicker: 'Frequently asked questions',
    faqTitle: 'The essential information before you contact us.',
    faqs: [
      {
        question: 'What should I tell you when I call?',
        answer:
          'Your exact location, vehicle type, a short description of the situation and the desired destination. We confirm availability, estimated timing and cost before departure.',
      },
      {
        question: 'Can I send my location on WhatsApp?',
        answer:
          'Yes. The WhatsApp button asks for location permission only when you choose it. If you do not allow access, you can still continue the conversation without automatic location sharing.',
      },
      {
        question: 'Do you recover vehicles from the A2 motorway?',
        answer:
          'Yes, around Fetești and within the area where we can intervene safely. Call with your exact position and we will confirm availability.',
      },
      {
        question: 'How far do you travel?',
        answer:
          'We normally cover approximately 40–50 km around Fetești. For longer distances, call us and we can confirm whether we can take the job.',
      },
      {
        question: 'How do I get a price?',
        answer:
          'The cost depends on your location, vehicle and destination. We discuss it clearly by phone before leaving for your location.',
      },
    ],
    footerCopy:
      'Vehicle recovery and roadside assistance starting from Fetești, covering the A2 area and approximately 40–50 km around the city. Longer distances are confirmed by phone.',
    navigation: 'Navigation',
    contactLegal: 'Contact & legal',
    privacy: 'Privacy',
    terms: 'Terms',
    rights: 'All rights reserved.',
    footerCoverage: 'Fetești · A2 · ~40–50 km · further by phone',
    mobileCall: 'Call now',
  },
} as const;

export default function Home() {
  const [language, setLanguage] = useState<Language>('ro');
  const [showMobileActions, setShowMobileActions] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const t = copy[language];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(languageStorageKey);
      if (saved === 'en' || saved === 'ro') {
        setLanguage(saved);
        document.documentElement.setAttribute('lang', saved);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowMobileActions(!entry?.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const switchLanguage = (next: Language) => {
    setLanguage(next);
    window.localStorage.setItem(languageStorageKey, next);
    document.documentElement.setAttribute('lang', next);
    window.dispatchEvent(new CustomEvent('taf-language-change', { detail: next }));
  };

  return (
    <main className="overflow-x-clip bg-[#f4f6f8] text-[#102235]">
      <section
        ref={heroRef}
        id="sus"
        className="roadside-hero relative isolate min-h-[760px] overflow-hidden bg-[#061522] text-white"
      >
        <Image
          src="/hero-tow-truck.png"
          alt={
            language === 'ro'
              ? 'Platformă de tractare care transportă în siguranță un autoturism pe autostradă'
              : 'Vehicle recovery truck safely transporting a car on the motorway'
          }
          fill
          priority
          sizes="100vw"
          className="object-cover object-[66%_center] scale-[1.015]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,16,27,.98)_0%,rgba(5,16,27,.93)_36%,rgba(5,16,27,.64)_61%,rgba(5,16,27,.22)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,16,27,.82)_0%,transparent_47%)]" />
        <div className="hero-grid absolute inset-0 opacity-40" aria-hidden="true" />

        <header className="relative z-20 mx-auto max-w-7xl px-4 pt-4 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between rounded-2xl border border-white/12 bg-[#071827]/72 px-3 py-3 shadow-2xl shadow-black/15 backdrop-blur-xl sm:px-4">
            <Link
              href="#sus"
              className="flex min-w-0 items-center gap-3"
              aria-label="Tractări Auto Fetești"
            >
              <span className="brand-mark relative h-13 w-13 shrink-0 overflow-hidden rounded-xl bg-[#071827]">
                <Image
                  src="/tractari-auto-fetesti-logo.webp"
                  alt=""
                  fill
                  sizes="52px"
                  className="object-cover"
                />
              </span>
              <span className="hidden min-w-0 leading-tight sm:block">
                <span className="block truncate text-sm font-black tracking-[-.01em] sm:text-[15px]">
                  Tractări Auto Fetești
                </span>
                <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-[.14em] text-white/55">
                  {t.brandSubline}
                </span>
              </span>
            </Link>

            <nav
              className="hidden items-center gap-7 text-sm font-bold text-white/72 lg:flex"
              aria-label={language === 'ro' ? 'Navigare principală' : 'Main navigation'}
            >
              <a href="#servicii" className="transition hover:text-[#ffd36f]">{t.nav.services}</a>
              <a href="#acoperire" className="transition hover:text-[#ffd36f]">{t.nav.coverage}</a>
              <a href="#recenzii" className="transition hover:text-[#ffd36f]">{t.nav.reviews}</a>
              <a href="#contact" className="transition hover:text-[#ffd36f]">{t.nav.contact}</a>
            </nav>

            <div className="flex items-center gap-2">
              <div
                className="inline-flex items-center rounded-xl border border-white/12 bg-white/[.06] p-1"
                aria-label={language === 'ro' ? 'Selectează limba' : 'Select language'}
              >
                <Languages className="ml-1 hidden h-4 w-4 text-white/55 sm:block" aria-hidden="true" />
                {(['ro', 'en'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => switchLanguage(item)}
                    aria-pressed={language === item}
                    className={`min-h-9 rounded-lg px-2.5 text-[11px] font-black uppercase tracking-[.08em] transition ${
                      language === item
                        ? 'bg-[#f6a817] text-[#071827]'
                        : 'text-white/62 hover:text-white'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <PhoneLink className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-3.5 text-sm font-black text-[#071827] transition hover:-translate-y-0.5 hover:bg-[#ffd36f] sm:px-4">
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{t.nav.call}</span>
                <span className="hidden md:inline">{phoneNumber}</span>
              </PhoneLink>
            </div>
          </div>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 pb-24 pt-14 sm:px-8 sm:pb-28 sm:pt-24 lg:grid-cols-[1.12fr_.88fr] lg:items-end lg:px-10 lg:pb-24 lg:pt-32">
          <div className="hero-copy max-w-3xl">
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#f6a817]/35 bg-[#f6a817]/12 px-3 py-1.5 text-xs font-black uppercase tracking-[.12em] text-[#ffd36f]">
                <span className="status-pulse h-2 w-2 rounded-full bg-[#f6a817]" />
                {t.availability}
              </span>
              <a
                href="#recenzii"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-bold text-white/78 transition hover:border-white/30 hover:text-white"
              >
                <BadgeCheck className="h-3.5 w-3.5 text-[#ffd36f]" aria-hidden="true" />
                {t.verifiedReviews}
              </a>
            </div>

            <h1 className="max-w-3xl text-[2.45rem] font-black leading-[.96] tracking-[-.058em] text-balance min-[390px]:text-[2.7rem] sm:text-6xl lg:text-[5.35rem]">
              {t.heroLine1}
              <span className="block text-[#f6a817]">{t.heroLine2}</span>
              {t.heroLine3}
            </h1>

            <p className="mt-5 max-w-2xl text-[15px] font-medium leading-6 text-white/72 sm:mt-7 sm:text-lg sm:leading-8">
              {t.heroCopy}
            </p>

            <div className="mt-7 grid grid-cols-[1.12fr_.88fr] gap-2.5 sm:mt-9 sm:flex sm:flex-row sm:gap-3">
              <PhoneLink className="cta-primary group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#f6a817] px-3 text-sm font-black text-[#071827] shadow-[0_18px_55px_rgba(246,168,23,.22)] transition hover:-translate-y-0.5 hover:bg-[#ffc451] sm:min-h-16 sm:gap-3 sm:px-6 sm:text-base">
                <Phone className="h-5 w-5" aria-hidden="true" />
                <span>{t.callNow}</span>
                <span className="hidden sm:inline">· {phoneNumber}</span>
                <ArrowRight className="hidden h-4 w-4 transition group-hover:translate-x-1 sm:block" aria-hidden="true" />
              </PhoneLink>

              <WhatsAppLocationButton className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/24 bg-white/8 px-3 text-sm font-black text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/13 sm:min-h-16 sm:gap-3 sm:px-6 sm:text-base">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                <span className="sm:hidden">WhatsApp</span>
                <span className="hidden sm:inline">{t.whatsappLocation}</span>
              </WhatsAppLocationButton>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/60 sm:mt-7 sm:gap-x-7 sm:gap-y-3 sm:text-sm">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#ffd36f]" aria-hidden="true" />
                {t.safePickup}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-[#ffd36f]" aria-hidden="true" />
                {t.timeAndCost}
              </span>
            </div>
          </div>

          <aside className="hero-panel hidden overflow-hidden rounded-[2rem] border border-white/13 bg-[#071827]/76 p-5 shadow-[0_28px_80px_rgba(0,0,0,.32)] backdrop-blur-xl lg:block">
            <div className="rounded-[1.55rem] border border-white/10 bg-white/[.045] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.14em] text-[#ffd36f]">{t.quickIntervention}</p>
                  <h2 className="mt-2 text-2xl font-black tracking-[-.04em]">{t.tellUs3}</h2>
                </div>
                <Navigation className="h-5 w-5 text-[#ffd36f]" aria-hidden="true" />
              </div>

              <div className="hero-zone-map mt-7" aria-hidden="true">
                <span className="hero-zone-ring hero-zone-ring-outer" />
                <span className="hero-zone-ring hero-zone-ring-middle" />
                <span className="hero-zone-ring hero-zone-ring-inner" />
                <span className="hero-zone-axis hero-zone-axis-x" />
                <span className="hero-zone-axis hero-zone-axis-y" />
                <div className="hero-zone-radius-label">~40–50 KM</div>
                <div className="hero-zone-core">
                  <Navigation className="h-4 w-4" />
                  <strong>FETEȘTI</strong>
                  <small>START</small>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {t.heroSteps.map(([number, title, stepCopy]) => (
                  <div key={number} className="rounded-xl border border-white/8 bg-black/12 p-3">
                    <span className="text-[10px] font-black uppercase tracking-[.12em] text-[#f6a817]">{number}</span>
                    <p className="mt-1.5 text-xs font-black text-white">{title}</p>
                    <p className="mt-1 text-[10px] leading-4 text-white/45">{stepCopy}</p>
                  </div>
                ))}
              </div>

              <p className="mt-5 border-t border-white/10 pt-5 text-xs leading-5 text-white/48">
                {t.noInventedPrices}
              </p>
            </div>
          </aside>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-3 overflow-hidden rounded-t-3xl border-x border-t border-white/10 bg-[#0b2235]/94 shadow-2xl backdrop-blur-xl">
              {t.proof.map(([strong, label]) => (
                <div key={label} className="flex min-w-0 flex-col justify-center border-r border-white/8 px-2.5 py-3.5 last:border-r-0 sm:flex-row sm:items-center sm:gap-3 sm:px-5 sm:py-4">
                  <span className="truncate text-base font-black tracking-[-.04em] text-[#ffd36f] sm:text-xl">{strong}</span>
                  <span className="mt-0.5 text-[9px] font-bold uppercase leading-3 tracking-[.08em] text-white/53 sm:mt-0 sm:text-xs sm:leading-normal sm:tracking-[.09em]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="recenzii" className="scroll-mt-24 border-y border-[#dce3e9] bg-[#eaf0f4] py-12 sm:py-16 lg:py-18">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <GoogleReviews language={language} />
        </div>
      </section>

      <section id="servicii" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
            <div>
              <p className="section-kicker">{t.servicesKicker}</p>
              <h2 className="section-title max-w-xl">{t.servicesTitle}</h2>
            </div>
            <p className="section-copy lg:ml-auto lg:max-w-xl">{t.servicesCopy}</p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.services.map((service) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.number}
                  className="service-card group relative overflow-hidden rounded-[1.6rem] border border-[#d8e0e7] bg-white p-6 shadow-[0_14px_42px_rgba(13,34,52,.055)]"
                >
                  <div className="absolute right-5 top-4 text-[3.5rem] font-black tracking-[-.08em] text-[#102235]/[.035]">
                    {service.number}
                  </div>
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#0b2235] text-[#ffd36f] transition group-hover:-translate-y-1 group-hover:bg-[#f6a817] group-hover:text-[#071827]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-8 text-xl font-black tracking-[-.035em]">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#607183]">{service.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#081a29] py-20 text-white sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
            <div className="lg:sticky lg:top-10">
              <p className="section-kicker text-[#ffd36f]">{t.howKicker}</p>
              <h2 className="mt-4 max-w-xl text-4xl font-black leading-[1.02] tracking-[-.05em] sm:text-5xl">
                {t.howTitle}
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/60">{t.howCopy}</p>
            </div>

            <div className="route-flow">
              {t.howSteps.map(([number, title, stepText, Icon], index) => {
                const StepIcon = Icon as typeof Phone;
                return (
                  <article key={number as string} className="relative grid gap-5 border-t border-white/10 py-7 sm:grid-cols-[72px_1fr] sm:gap-7">
                    <div className="flex items-center gap-3 sm:block">
                      <span className="text-3xl font-black tracking-[-.05em] text-[#f6a817]">{number as string}</span>
                      <span className="ml-auto grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[.05] text-[#ffd36f] sm:ml-0 sm:mt-3">
                        <StepIcon className="h-4.5 w-4.5" aria-hidden="true" />
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-[-.035em]">{title as string}</h3>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-white/58">{stepText as string}</p>
                    </div>
                    {index < 2 ? <span className="route-node" aria-hidden="true" /> : null}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="acoperire" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="coverage-shell overflow-hidden rounded-[2rem] border border-[#d6dfe7] bg-white shadow-[0_24px_65px_rgba(13,34,52,.06)]">
            <div className="grid lg:grid-cols-[.88fr_1.12fr]">
              <div className="p-7 sm:p-10 lg:p-12">
                <p className="section-kicker">{t.coverageKicker}</p>
                <h2 className="mt-4 text-4xl font-black leading-[1.03] tracking-[-.05em] sm:text-5xl">
                  {t.coverageTitle}
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-[#607183]">
                  {t.coverageCopy}
                </p>
                <div className="mt-7 inline-flex items-center gap-2 rounded-xl border border-[#dce3e9] bg-[#f7f9fa] px-4 py-3 text-sm font-bold text-[#52677b]">
                  <Clock3 className="h-4 w-4 text-[#a46600]" aria-hidden="true" />
                  {language === 'ro'
                    ? 'Pentru mai departe de zona uzuală, confirmăm disponibilitatea înainte de plecare.'
                    : 'Beyond the usual area, we confirm availability before departure.'}
                </div>
              </div>

              <div className="coverage-visual relative min-h-[370px] overflow-hidden bg-[#0b2235] p-7 text-white sm:p-10">
                <div className="absolute inset-0 opacity-50">
                  <span className="road-line road-line-a" />
                  <span className="road-line road-line-b" />
                  <span className="road-line road-line-c" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[.12em] text-[#ffd36f]">
                    <Navigation className="h-4 w-4" aria-hidden="true" />
                    {t.interventionArea}
                  </div>
                  <div className="mt-7 flex flex-wrap gap-2.5">
                    {t.coverage.map((place, index) => (
                      <span
                        key={place}
                        className={`rounded-full border px-4 py-2.5 text-sm font-bold backdrop-blur-sm ${
                          index < 2
                            ? 'border-[#f6a817]/45 bg-[#f6a817]/15 text-[#ffd36f]'
                            : 'border-white/12 bg-white/[.055] text-white/76'
                        }`}
                      >
                        {place}
                      </span>
                    ))}
                  </div>
                  <div className="mt-10 rounded-2xl border border-white/10 bg-black/15 p-5">
                    <p className="text-xs font-black uppercase tracking-[.12em] text-white/48">{t.startingPoint}</p>
                    <p className="mt-2 text-xl font-black">Strada Călărași nr. 1, Fetești</p>
                    <a
                      href="https://www.google.com/maps/place/Tractari+Auto/@44.3732589,27.8391185,17z/data=!4m8!3m7!1s0x40b071ea7db3ce0b:0xbe0630d2e820814a!8m2!3d44.3732589!4d27.8391185!9m1!1b1!16s%2Fg%2F11xn6j9csd"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#ffd36f] hover:text-white"
                    >
                      {t.openMaps}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      <section id="contact" className="scroll-mt-24 bg-[#071827] py-20 text-white sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="contact-panel relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(125deg,#0e2a42,#081724)] p-7 sm:p-10 lg:p-12">
            <div className="contact-glow absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[#f6a817]/18 blur-3xl" aria-hidden="true" />
            <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_.75fr] lg:items-end">
              <div>
                <p className="section-kicker text-[#ffd36f]">{t.needHelp}</p>
                <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[.98] tracking-[-.055em] sm:text-6xl">
                  {t.shortCall}
                </h2>
                <p className="mt-6 max-w-xl text-base leading-7 text-white/62">
                  {t.contactCopy}
                </p>
              </div>

              <div className="grid gap-3">
                <PhoneLink className="group inline-flex min-h-16 items-center justify-between gap-4 rounded-2xl bg-[#f6a817] px-5 text-base font-black text-[#071827] transition hover:bg-[#ffc451]">
                  <span className="inline-flex items-center gap-3">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                    {phoneNumber}
                  </span>
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" aria-hidden="true" />
                </PhoneLink>
                <WhatsAppLocationButton className="inline-flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/[.06] px-5 text-left text-base font-black text-white transition hover:bg-white/[.1]">
                  <span className="inline-flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-[#ffd36f]" aria-hidden="true" />
                    {t.whatsappLocation}
                  </span>
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </WhatsAppLocationButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="intrebari" className="mx-auto max-w-5xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
        <div className="text-center">
          <p className="section-kicker">{t.faqKicker}</p>
          <h2 className="section-title mx-auto max-w-2xl">{t.faqTitle}</h2>
        </div>

        <div className="mt-10 divide-y divide-[#dce2e9] overflow-hidden rounded-[1.6rem] border border-[#dce2e9] bg-white shadow-[0_16px_45px_rgba(13,34,52,.05)]">
          {t.faqs.map((faq) => (
            <details key={faq.question} className="faq-row group px-6 py-5 sm:px-8">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-base font-black text-[#1e344b]">
                {faq.question}
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f3f5f7] text-xl font-medium text-[#a46600] transition group-open:rotate-45 group-open:bg-[#f6a817] group-open:text-[#071827]">
                  +
                </span>
              </summary>
              <p className="max-w-3xl pt-3 pr-12 text-sm leading-6 text-[#607183]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="bg-[#05131f] pb-24 pt-12 text-white/66 sm:pb-12">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:grid-cols-[1.3fr_.7fr_.7fr] sm:px-8 lg:px-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="relative h-11 w-11 overflow-hidden rounded-xl bg-[#071827]">
                <Image
                  src="/tractari-auto-fetesti-logo.webp"
                  alt=""
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </span>
              <p className="text-lg font-black text-white">Tractări Auto Fetești</p>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6">{t.footerCopy}</p>
          </div>

          <div>
            <p className="text-sm font-black text-white">{t.navigation}</p>
            <div className="mt-4 grid gap-2.5 text-sm">
              <a href="#servicii" className="hover:text-[#ffd36f]">{t.nav.services}</a>
              <a href="#acoperire" className="hover:text-[#ffd36f]">{t.nav.coverage}</a>
              <a href="#recenzii" className="hover:text-[#ffd36f]">{t.nav.reviews}</a>
              <a href="#contact" className="hover:text-[#ffd36f]">{t.nav.contact}</a>
            </div>
          </div>

          <div>
            <p className="text-sm font-black text-white">{t.contactLegal}</p>
            <div className="mt-4 grid gap-2.5 text-sm">
              <PhoneLink className="font-bold text-[#ffd36f] hover:text-white">{phoneNumber}</PhoneLink>
              <a href="mailto:tractariautofetesti24@gmail.com" className="hover:text-[#ffd36f]">Email</a>
              <Link href="/confidentialitate" className="hover:text-[#ffd36f]">{t.privacy}</Link>
              <Link href="/termeni" className="hover:text-[#ffd36f]">{t.terms}</Link>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-2 border-t border-white/10 px-5 pt-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <span>© {new Date().getFullYear()} Tractări Auto Fetești. {t.rights}</span>
          <span>{t.footerCoverage}</span>
        </div>
      </footer>

      {showMobileActions ? (
        <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1.15fr_.85fr] gap-2 border-t border-white/8 bg-[#061522]/95 p-2.5 shadow-[0_-12px_38px_rgba(7,24,39,.28)] backdrop-blur-xl sm:hidden">
          <PhoneLink className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#f6a817] px-3 text-sm font-black text-[#071827]">
            <Phone className="h-4 w-4" aria-hidden="true" />
            {t.mobileCall}
          </PhoneLink>
          <WhatsAppLocationButton className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.08] px-3 text-sm font-black text-white">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </WhatsAppLocationButton>
        </div>
      ) : null}
    </main>
  );
}
