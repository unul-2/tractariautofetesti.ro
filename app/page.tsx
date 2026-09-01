import Image from 'next/image';
import Link from 'next/link';
import {
  PhoneLink,
  phoneNumber,
  WhatsAppLocationButton,
} from '@/components/conversion-links';
import { GoogleReviews } from '@/components/google-reviews';

const services = [
  {
    number: '01',
    title: 'Tractări auto',
    text: 'Preluare sigură pentru autoturisme care nu mai pot circula.',
  },
  {
    number: '02',
    title: 'Remorcări și transport',
    text: 'Transport organizat către service, domiciliu sau destinația stabilită împreună.',
  },
  {
    number: '03',
    title: 'Asistență rutieră',
    text: 'Spune-ne situația la telefon și stabilim corect intervenția necesară.',
  },
  {
    number: '04',
    title: 'Preluare de pe A2',
    text: 'Asistență pentru zona Fetești și principalele localități de pe traseu.',
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
    <main className="overflow-x-clip bg-[#f7f8fa] text-[#112238]">
      <section className="relative isolate min-h-[680px] overflow-hidden bg-[#071827] text-white sm:min-h-[720px]">
        <Image
          src="/hero-tow-truck.png"
          alt="Platformă de tractare care transportă în siguranță un autoturism pe autostradă"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,18,32,.96)_0%,rgba(5,18,32,.86)_40%,rgba(5,18,32,.42)_70%,rgba(5,18,32,.16)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,18,32,.72),transparent_42%)]" />

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Link
            href="#sus"
            className="flex items-center gap-3"
            aria-label="Tractări Auto Fetești - început"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f7a71b] text-base font-black text-[#071827] shadow-lg shadow-[#f7a71b]/20">
              TA
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-extrabold tracking-[0.02em]">
                Tractări Auto
              </span>
              <span className="block text-xs text-white/68">
                Fetești · Non-Stop
              </span>
            </span>
          </Link>
          <nav
            className="hidden items-center gap-6 text-sm font-semibold text-white/80 lg:flex"
            aria-label="Navigare principală"
          >
            <a href="#servicii" className="transition hover:text-white">
              Servicii
            </a>
            <a href="#acoperire" className="transition hover:text-white">
              Acoperire
            </a>
            <a href="#despre" className="transition hover:text-white">
              Despre noi
            </a>
            <a href="#contact" className="transition hover:text-white">
              Contact
            </a>
          </nav>
          <PhoneLink className="rounded-xl border border-white/30 bg-white/10 px-3.5 py-2.5 text-sm font-extrabold transition hover:border-[#f7a71b] hover:bg-[#f7a71b] hover:text-[#071827] sm:px-4">
            <span className="hidden sm:inline">Sună: </span>
            {phoneNumber}
          </PhoneLink>
        </header>

        <div
          id="sus"
          className="relative z-10 mx-auto flex max-w-7xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:px-10 lg:pt-36"
        >
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#f7a71b]/35 bg-[#f7a71b]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[.12em] text-[#ffd06e]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f7a71b]" /> Fetești
              · A2 · Dobrogea
            </p>
            <h1 className="max-w-xl text-4xl font-extrabold leading-[1.03] tracking-[-.045em] text-balance sm:text-6xl">
              Tractări Auto Fetești Non-Stop.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/82 sm:text-lg">
              Ai rămas în pană pe A2 sau în Fetești? Sună acum și ieși rapid
              din impas — flotă proprie, preț corect și comunicare clară înainte
              de plecare.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PhoneLink className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#f7a71b] px-6 text-base font-extrabold text-[#071827] shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#ffc558]">
                Sună acum · {phoneNumber}
              </PhoneLink>
              <WhatsAppLocationButton className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/35 bg-white/10 px-6 text-base font-extrabold text-white transition hover:border-white hover:bg-white/18">
                WhatsApp + locație
              </WhatsAppLocationButton>
            </div>
            <a className="mt-5 inline-block text-sm font-bold text-white/80 underline underline-offset-4 hover:text-[#ffd06e]" href="mailto:tractariautofetesti24@gmail.com">
              tractariautofetesti24@gmail.com
            </a>
            <p className="mt-4 text-xs leading-5 text-white/60">
              Apelul este cea mai rapidă cale. WhatsApp-ul îți permite să
              trimiți poziția, doar dacă alegi tu.
            </p>
          </div>
        </div>
      </section>

      <section
        className="border-b border-[#dce2e9] bg-white"
        aria-label="Avantaje"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-[#dce2e9] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-10">
          {[
            'Disponibilitate non-stop',
            'Preluare în condiții de siguranță',
            'Confirmare clară înainte de plecare',
          ].map((item) => (
            <p
              key={item}
              className="py-5 text-center text-sm font-bold text-[#24364d] sm:py-6"
            >
              {item}
            </p>
          ))}
        </div>
      </section>

      <section
        id="servicii"
        className="mx-auto max-w-7xl scroll-mt-10 px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
      >
        <div className="max-w-2xl">
          <p className="section-kicker">Servicii</p>
          <h2 className="section-title">
            Asistență potrivită situației tale, fără presupuneri.
          </h2>
          <p className="section-copy">
            La un apel bun, primele detalii sunt cele care contează: unde ești,
            ce mașină ai și unde trebuie dusă. De acolo stabilim intervenția
            corectă.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article
              key={service.number}
              className="rounded-2xl border border-[#dce2e9] bg-white p-6 shadow-[0_12px_35px_rgba(17,34,56,.05)]"
            >
              <p className="text-xs font-black tracking-[.16em] text-[#dc8d09]">
                {service.number}
              </p>
              <h3 className="mt-7 text-xl font-extrabold tracking-[-.025em]">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#52657a]">
                {service.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="despre"
        className="scroll-mt-10 bg-[#0c2035] py-20 text-white lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:px-10">
          <div>
            <p className="section-kicker text-[#ffd06e]">Despre noi</p>
            <h2 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight tracking-[-.035em] sm:text-5xl">
              Un serviciu de urgență trebuie să pară simplu, nu stresant.
            </h2>
          </div>
          <div className="border-l border-white/20 pl-6 sm:pl-8">
            <p className="text-base leading-7 text-white/78">
              Tractări Auto Fetești este construit în jurul unei promisiuni
              simple: comunici direct cu omul care îți confirmă dacă poate
              prelua situația și care sunt pașii următori.
            </p>
            <p className="mt-5 text-base leading-7 text-white/78">
              Nu afișăm timp sau tarife inventate pe site. Le confirmăm corect,
              după locație, vehicul și destinație.
            </p>
          </div>
        </div>
      </section>

      <section
        id="acoperire"
        className="mx-auto max-w-7xl scroll-mt-10 px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
      >
        <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div>
            <p className="section-kicker">Acoperire</p>
            <h2 className="section-title">
              Punct de pornire Fetești. Intervenții confirmate telefonic.
            </h2>
            <p className="section-copy">
              Acoperirea reală depinde de poziția ta și de disponibilitate. Dacă
              ești pe A2 sau în zonă, sună: îți spunem imediat dacă putem prelua
              cazul.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {coverage.map((place) => (
              <span
                key={place}
                className="rounded-full border border-[#cbd6e2] bg-white px-4 py-2.5 text-sm font-bold text-[#30465d]"
              >
                {place}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eaf0f5] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <p className="section-kicker">Cum procedăm</p>
          <h2 className="section-title max-w-2xl">
            Trei pași, o situație mai clară.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              [
                '1',
                'Ne suni sau ne scrii',
                'Spui unde ești, ce mașină ai și ce s-a întâmplat.',
              ],
              [
                '2',
                'Confirmăm intervenția',
                'Primești confirmarea disponibilității, timpului estimat și costului.',
              ],
              [
                '3',
                'Preluăm în siguranță',
                'Stabilim destinația și ținem legătura până la finalizarea preluării.',
              ],
            ].map(([number, title, text]) => (
              <article key={number} className="rounded-2xl bg-white p-7">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0c2035] text-sm font-black text-[#ffd06e]">
                  {number}
                </span>
                <h3 className="mt-7 text-xl font-extrabold tracking-[-.025em]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#52657a]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="recenzii" className="mx-auto max-w-7xl scroll-mt-10 px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <GoogleReviews />
      </section>

      <section
        id="contact"
        className="scroll-mt-10 bg-[#0c2035] py-20 text-white lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10">
          <div>
            <p className="section-kicker text-[#ffd06e]">Contact și locație</p>
            <h2 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight tracking-[-.035em] sm:text-5xl">
              Ai nevoie de ajutor acum?
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/78">
              Sună pentru confirmare imediată. Dacă îți este mai ușor, trimite
              locația pe WhatsApp — cu acordul tău, când alegi butonul.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PhoneLink className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#f7a71b] px-6 text-base font-extrabold text-[#071827] transition hover:bg-[#ffc558]">
                Sună {phoneNumber}
              </PhoneLink>
              <WhatsAppLocationButton className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/30 px-6 text-base font-extrabold text-white transition hover:bg-white/10">
                WhatsApp + locație
              </WhatsAppLocationButton>
            </div>
            <a className="mt-5 inline-block text-sm font-bold text-white/80 underline underline-offset-4 hover:text-[#ffd06e]" href="mailto:tractariautofetesti24@gmail.com">
              tractariautofetesti24@gmail.com
            </a>
          </div>
          <a
            className="flex min-h-72 flex-col justify-end rounded-3xl border border-white/15 bg-[radial-gradient(circle_at_70%_28%,rgba(247,167,27,.32),transparent_25%),linear-gradient(145deg,#173a58,#081725)] p-7 transition hover:border-[#f7a71b]/60"
            href="https://www.google.com/maps/place/Tractari+Auto/@44.3732589,27.8391185,17z/data=!4m8!3m7!1s0x40b071ea7db3ce0b:0xbe0630d2e820814a!8m2!3d44.3732589!4d27.8391185!9m1!1b1!16s%2Fg%2F11xn6j9csd"
            target="_blank"
            rel="noreferrer"
          >
            <p className="text-sm font-bold text-[#ffd06e]">Punct de pornire</p>
            <p className="mt-2 text-3xl font-extrabold tracking-[-.03em]">
              Strada Călărași nr. 1, Fetești
            </p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/75">
              Punct de lucru declarat în profilul Google. La apel confirmăm
              intervenția la locația ta exactă.
            </p>
            <span className="mt-6 text-sm font-extrabold">
              Deschide în Google Maps ↗
            </span>
          </a>
        </div>
      </section>

      <section
        id="intrebari"
        className="mx-auto max-w-4xl scroll-mt-10 px-5 py-20 sm:px-8 lg:py-28"
      >
        <div className="text-center">
          <p className="section-kicker">Întrebări</p>
          <h2 className="section-title">
            Răspunsurile de care ai nevoie, înainte să suni.
          </h2>
        </div>
        <div className="mt-10 divide-y divide-[#dce2e9] rounded-2xl border border-[#dce2e9] bg-white px-6 sm:px-8">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-base font-extrabold text-[#1e344b]">
                {faq.question}
                <span className="text-xl font-normal text-[#dc8d09] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-3xl pt-3 text-sm leading-6 text-[#52657a]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <footer className="bg-[#071827] pb-24 pt-12 text-white/72 sm:pb-12">
        <div className="mx-auto grid max-w-7xl gap-9 px-5 sm:grid-cols-[1.3fr_.7fr_.7fr] sm:px-8 lg:px-10">
          <div>
            <p className="text-lg font-extrabold text-white">
              Tractări Auto Fetești
            </p>
            <p className="mt-3 max-w-sm text-sm leading-6">
              Tractare și asistență rutieră pentru Fetești, A2 și localitățile
              din zona de acoperire confirmată telefonic.
            </p>
          </div>
          <div>
            <p className="text-sm font-extrabold text-white">Navigare</p>
            <div className="mt-3 grid gap-2 text-sm">
              <a href="#servicii" className="hover:text-[#ffd06e]">
                Servicii
              </a>
              <a href="#acoperire" className="hover:text-[#ffd06e]">
                Acoperire
              </a>
              <a href="#recenzii" className="hover:text-[#ffd06e]">
                Recenzii
              </a>
              <a href="#contact" className="hover:text-[#ffd06e]">
                Contact și locație
              </a>
            </div>
          </div>
          <div>
            <p className="text-sm font-extrabold text-white">Legal</p>
            <div className="mt-3 grid gap-2 text-sm">
              <Link href="/confidentialitate" className="hover:text-[#ffd06e]">
                Politica de confidențialitate
              </Link>
              <Link href="/termeni" className="hover:text-[#ffd06e]">
                Termeni de utilizare
              </Link>
              <a href="#intrebari" className="hover:text-[#ffd06e]">
                Întrebări frecvente
              </a>
              <PhoneLink className="font-bold text-[#ffd06e] hover:text-white">
                {phoneNumber}
              </PhoneLink>
              <a className="hover:text-[#ffd06e]" href="mailto:tractariautofetesti24@gmail.com">
                Email
              </a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 px-5 pt-5 text-xs sm:px-8 lg:px-10">
          © {new Date().getFullYear()} Tractări Auto Fetești. Toate drepturile
          rezervate.
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-px bg-[#071827] p-2 shadow-[0_-8px_28px_rgba(7,24,39,.22)] sm:hidden">
        <PhoneLink className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#f7a71b] px-3 text-sm font-extrabold text-[#071827]">
          Sună acum
        </PhoneLink>
        <WhatsAppLocationButton className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#1d3650] px-3 text-sm font-extrabold text-white">
          WhatsApp
        </WhatsAppLocationButton>
      </div>
    </main>
  );
}
