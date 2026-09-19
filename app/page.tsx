import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
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

const services = [
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
    text: 'Intervenții pentru zona Fetești și principalele puncte de pe Autostrada Soarelui.',
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
];

const coverage = [
  'Fetești',
  'A2 Autostrada Soarelui',
  'Cernavodă',
  'Hârșova',
  'Medgidia',
  'Constanța',
  'Călărași',
  'Slobozia',
  'Brăila',
];

const faqs = [
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
      'Da, pentru situațiile în care intervenția se poate face în siguranță și în limitele zonei de acoperire. Sună pentru confirmare rapidă.',
  },
  {
    question: 'Cum aflu costul?',
    answer:
      'Costul depinde de poziție, tipul vehiculului și destinație. Îl discutăm clar la telefon, înainte să plecăm către tine.',
  },
];

export default function Home() {
  return (
    <main className="overflow-x-clip bg-[#f4f6f8] text-[#102235]">
      <section
        id="sus"
        className="roadside-hero relative isolate min-h-[760px] overflow-hidden bg-[#061522] text-white"
      >
        <Image
          src="/hero-tow-truck.png"
          alt="Platformă de tractare care transportă în siguranță un autoturism pe autostradă"
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
              aria-label="Tractări Auto Fetești - început"
            >
              <span className="brand-mark grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f6a817] text-[13px] font-black tracking-[-.04em] text-[#071827]">
                TA
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-sm font-black tracking-[-.01em] sm:text-[15px]">
                  Tractări Auto Fetești
                </span>
                <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-[.14em] text-white/55">
                  24/7 · A2 · Ialomița
                </span>
              </span>
            </Link>

            <nav
              className="hidden items-center gap-7 text-sm font-bold text-white/72 lg:flex"
              aria-label="Navigare principală"
            >
              <a href="#servicii" className="transition hover:text-[#ffd36f]">Servicii</a>
              <a href="#acoperire" className="transition hover:text-[#ffd36f]">Acoperire</a>
              <a href="#recenzii" className="transition hover:text-[#ffd36f]">Recenzii</a>
              <a href="#contact" className="transition hover:text-[#ffd36f]">Contact</a>
            </nav>

            <PhoneLink className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-3.5 text-sm font-black text-[#071827] transition hover:-translate-y-0.5 hover:bg-[#ffd36f] sm:px-4">
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Sună</span>
              <span className="hidden md:inline">{phoneNumber}</span>
            </PhoneLink>
          </div>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 pb-28 pt-20 sm:px-8 sm:pt-28 lg:grid-cols-[1.12fr_.88fr] lg:items-end lg:px-10 lg:pb-24 lg:pt-32">
          <div className="hero-copy max-w-3xl">
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#f6a817]/35 bg-[#f6a817]/12 px-3 py-1.5 text-xs font-black uppercase tracking-[.12em] text-[#ffd36f]">
                <span className="status-pulse h-2 w-2 rounded-full bg-[#f6a817]" />
                Disponibilitate non-stop
              </span>
              <a
                href="#recenzii"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-bold text-white/78 transition hover:border-white/30 hover:text-white"
              >
                <BadgeCheck className="h-3.5 w-3.5 text-[#ffd36f]" aria-hidden="true" />
                Recenzii Google verificate
              </a>
            </div>

            <h1 className="max-w-3xl text-[2.8rem] font-black leading-[.96] tracking-[-.058em] text-balance sm:text-6xl lg:text-[5.35rem]">
              Tractări auto
              <span className="block text-[#f6a817]">Fetești & A2.</span>
              Ajutor fără complicații.
            </h1>

            <p className="mt-7 max-w-2xl text-base font-medium leading-7 text-white/72 sm:text-lg sm:leading-8">
              Ai rămas în pană sau mașina nu mai poate circula? Ne spui unde ești,
              ce vehicul ai și destinația. Confirmăm clar intervenția înainte de
              plecare.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <PhoneLink className="cta-primary group inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-[#f6a817] px-6 text-base font-black text-[#071827] shadow-[0_18px_55px_rgba(246,168,23,.22)] transition hover:-translate-y-0.5 hover:bg-[#ffc451]">
                <Phone className="h-5 w-5" aria-hidden="true" />
                Sună acum · {phoneNumber}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </PhoneLink>

              <WhatsAppLocationButton className="inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl border border-white/24 bg-white/8 px-6 text-base font-black text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/13">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                WhatsApp + locație
              </WhatsAppLocationButton>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-white/60">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#ffd36f]" aria-hidden="true" />
                Preluare în siguranță
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-[#ffd36f]" aria-hidden="true" />
                Timp și cost confirmate telefonic
              </span>
            </div>
          </div>

          <aside className="hero-panel hidden rounded-[2rem] border border-white/13 bg-[#071827]/72 p-5 shadow-[0_28px_80px_rgba(0,0,0,.28)] backdrop-blur-xl lg:block">
            <div className="rounded-[1.55rem] border border-white/10 bg-white/[.055] p-6">
              <p className="text-xs font-black uppercase tracking-[.14em] text-[#ffd36f]">Intervenție rapidă</p>
              <h2 className="mt-3 text-2xl font-black tracking-[-.04em]">Spune-ne 3 lucruri.</h2>
              <div className="mt-6 grid gap-3">
                {[
                  ['01', 'Unde ești', 'Trimite locația sau reperul exact.'],
                  ['02', 'Ce mașină ai', 'Marcă, model și situația pe scurt.'],
                  ['03', 'Unde mergem', 'Service, domiciliu sau altă destinație.'],
                ].map(([number, title, copy]) => (
                  <div key={number} className="group flex gap-4 rounded-2xl border border-white/8 bg-black/10 p-4 transition hover:border-[#f6a817]/35 hover:bg-[#f6a817]/7">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f6a817] text-xs font-black text-[#071827]">
                      {number}
                    </span>
                    <div>
                      <p className="text-sm font-black">{title}</p>
                      <p className="mt-1 text-xs leading-5 text-white/52">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 border-t border-white/10 pt-5 text-xs leading-5 text-white/48">
                Nu afișăm timpi sau tarife inventate. Confirmăm situația concretă înainte de plecare.
              </p>
            </div>
          </aside>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid overflow-hidden rounded-t-3xl border-x border-t border-white/10 bg-[#0b2235]/94 shadow-2xl backdrop-blur-xl sm:grid-cols-3">
              {[
                ['24/7', 'Disponibilitate'],
                ['A2', 'Autostrada Soarelui'],
                ['Direct', 'Confirmare la telefon'],
              ].map(([strong, label]) => (
                <div key={label} className="flex items-center gap-3 border-b border-white/8 px-5 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                  <span className="text-xl font-black tracking-[-.04em] text-[#ffd36f]">{strong}</span>
                  <span className="text-xs font-bold uppercase tracking-[.09em] text-white/53">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="servicii" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
            <div>
              <p className="section-kicker">Servicii</p>
              <h2 className="section-title max-w-xl">
                Exact ce ai nevoie când mașina nu mai merge.
              </h2>
            </div>
            <p className="section-copy lg:ml-auto lg:max-w-xl">
              Fără meniuri complicate și fără formulare lungi. Ne dai informația
              esențială, stabilim ce poate fi făcut și confirmăm intervenția.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
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
                  <span className="mt-7 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[.1em] text-[#a46600]">
                    Confirmăm telefonic
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" aria-hidden="true" />
                  </span>
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
              <p className="section-kicker text-[#ffd36f]">Cum procedăm</p>
              <h2 className="mt-4 max-w-xl text-4xl font-black leading-[1.02] tracking-[-.05em] sm:text-5xl">
                De la problemă la soluție, fără zgomot inutil.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/60">
                Într-o situație de urgență, pagina trebuie să te ajute să iei o
                decizie rapidă. Restul îl clarificăm direct.
              </p>
            </div>

            <div className="route-flow">
              {[
                ['01', 'Ne contactezi', 'Suni sau trimiți un mesaj cu locația și situația mașinii.', Phone],
                ['02', 'Confirmăm', 'Îți spunem disponibilitatea, timpul estimat și costul pentru cazul tău.', BadgeCheck],
                ['03', 'Preluăm', 'Stabilim destinația și organizăm transportul în condiții de siguranță.', Truck],
              ].map(([number, title, text, Icon], index) => {
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
                      <p className="mt-2 max-w-xl text-sm leading-6 text-white/58">{text as string}</p>
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
                <p className="section-kicker">Acoperire</p>
                <h2 className="mt-4 text-4xl font-black leading-[1.03] tracking-[-.05em] sm:text-5xl">
                  Fetești este punctul nostru de plecare.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-[#607183]">
                  Pentru A2 și localitățile din jur, disponibilitatea reală se
                  confirmă la telefon în funcție de poziția și situația ta.
                </p>
                <PhoneLink className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#0b2235] px-5 text-sm font-black text-white transition hover:bg-[#173c5c]">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Verifică disponibilitatea
                </PhoneLink>
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
                    Zona de intervenție
                  </div>
                  <div className="mt-7 flex flex-wrap gap-2.5">
                    {coverage.map((place, index) => (
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
                    <p className="text-xs font-black uppercase tracking-[.12em] text-white/48">Punct de pornire</p>
                    <p className="mt-2 text-xl font-black">Strada Călărași nr. 1, Fetești</p>
                    <a
                      href="https://www.google.com/maps/place/Tractari+Auto/@44.3732589,27.8391185,17z/data=!4m8!3m7!1s0x40b071ea7db3ce0b:0xbe0630d2e820814a!8m2!3d44.3732589!4d27.8391185!9m1!1b1!16s%2Fg%2F11xn6j9csd"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#ffd36f] hover:text-white"
                    >
                      Deschide în Google Maps
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="recenzii" className="scroll-mt-24 border-y border-[#dce3e9] bg-[#eaf0f4] py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <GoogleReviews />
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 bg-[#071827] py-20 text-white sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="contact-panel relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(125deg,#0e2a42,#081724)] p-7 sm:p-10 lg:p-12">
            <div className="contact-glow absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[#f6a817]/18 blur-3xl" aria-hidden="true" />
            <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_.75fr] lg:items-end">
              <div>
                <p className="section-kicker text-[#ffd36f]">Ai nevoie de ajutor acum?</p>
                <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[.98] tracking-[-.055em] sm:text-6xl">
                  Un apel scurt poate clarifica tot.
                </h2>
                <p className="mt-6 max-w-xl text-base leading-7 text-white/62">
                  Spune-ne locația, mașina și destinația. Îți confirmăm direct dacă putem prelua intervenția.
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
                    WhatsApp + locație
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
          <p className="section-kicker">Întrebări frecvente</p>
          <h2 className="section-title mx-auto max-w-2xl">
            Informația esențială, înainte să suni.
          </h2>
        </div>

        <div className="mt-10 divide-y divide-[#dce2e9] overflow-hidden rounded-[1.6rem] border border-[#dce2e9] bg-white shadow-[0_16px_45px_rgba(13,34,52,.05)]">
          {faqs.map((faq) => (
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
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f6a817] text-xs font-black text-[#071827]">TA</span>
              <p className="text-lg font-black text-white">Tractări Auto Fetești</p>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6">
              Tractare și asistență rutieră pentru Fetești, A2 și localitățile din zona de acoperire confirmată telefonic.
            </p>
          </div>

          <div>
            <p className="text-sm font-black text-white">Navigare</p>
            <div className="mt-4 grid gap-2.5 text-sm">
              <a href="#servicii" className="hover:text-[#ffd36f]">Servicii</a>
              <a href="#acoperire" className="hover:text-[#ffd36f]">Acoperire</a>
              <a href="#recenzii" className="hover:text-[#ffd36f]">Recenzii</a>
              <a href="#contact" className="hover:text-[#ffd36f]">Contact</a>
            </div>
          </div>

          <div>
            <p className="text-sm font-black text-white">Contact & legal</p>
            <div className="mt-4 grid gap-2.5 text-sm">
              <PhoneLink className="font-bold text-[#ffd36f] hover:text-white">{phoneNumber}</PhoneLink>
              <a href="mailto:tractariautofetesti24@gmail.com" className="hover:text-[#ffd36f]">Email</a>
              <Link href="/confidentialitate" className="hover:text-[#ffd36f]">Confidențialitate</Link>
              <Link href="/termeni" className="hover:text-[#ffd36f]">Termeni</Link>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-2 border-t border-white/10 px-5 pt-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <span>© {new Date().getFullYear()} Tractări Auto Fetești. Toate drepturile rezervate.</span>
          <span>Fetești · A2 · disponibilitate confirmată telefonic</span>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1.15fr_.85fr] gap-2 border-t border-white/8 bg-[#061522]/95 p-2.5 shadow-[0_-12px_38px_rgba(7,24,39,.28)] backdrop-blur-xl sm:hidden">
        <PhoneLink className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#f6a817] px-3 text-sm font-black text-[#071827]">
          <Phone className="h-4 w-4" aria-hidden="true" />
          Sună acum
        </PhoneLink>
        <WhatsAppLocationButton className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.08] px-3 text-sm font-black text-white">
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          WhatsApp
        </WhatsAppLocationButton>
      </div>
    </main>
  );
}
