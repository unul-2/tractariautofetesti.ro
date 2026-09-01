import Link from 'next/link';
import { CookiePreferencesButton } from '@/components/cookie-consent';

export const metadata = {
  title: 'Politica de confidențialitate | Tractări Auto Fetești',
  description:
    'Informații despre date personale, locație, cookie-uri și opțiunile vizitatorului.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#112238]">
      <header className="border-b border-[#dce2e9] bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="text-sm font-extrabold">
            ← Tractări Auto Fetești
          </Link>
          <CookiePreferencesButton className="text-sm font-bold text-[#9f6504] underline underline-offset-4">
            Preferințe cookie
          </CookiePreferencesButton>
        </div>
      </header>
      <article className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-24">
        <p className="section-kicker">Confidențialitate</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-[-.045em] sm:text-5xl">
          Politica de confidențialitate
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#52657a]">
          Această pagină explică, într-un limbaj clar, ce date pot apărea când
          folosești site-ul, în ce scop și ce alegeri ai la dispoziție.
        </p>

        <div className="mt-10 rounded-2xl border border-[#f2c66a] bg-[#fff8e8] p-5 text-sm leading-6 text-[#684500]">
          <strong>Înainte de publicare:</strong> această politică trebuie
          completată cu denumirea legală, CUI/CIF, sediul, e-mailul de contact
          pentru protecția datelor și perioada reală de păstrare a datelor. Nu
          publicăm versiunea finală până nu sunt confirmate de operator.
        </div>

        <div className="prose mt-12 max-w-none prose-slate prose-headings:font-extrabold prose-headings:tracking-[-.025em] prose-p:leading-7">
          <h2>1. Cine este operatorul datelor</h2>
          <p>
            Operatorul va fi identificat înainte de lansare prin denumirea
            legală, datele de contact și datele de facturare ale prestatorului
            serviciului de tractare. Numele comercial afișat pe site este
            „Tractări Auto Fetești”.
          </p>

          <h2>2. Ce date pot fi prelucrate</h2>
          <p>
            Site-ul nu include, în această versiune, un formular de comandă sau
            conturi de utilizator. Dacă alegi să suni ori să trimiți un mesaj pe
            WhatsApp, datele pe care le comunici voluntar pot include numărul de
            telefon, locația, date despre vehicul și detalii despre intervenție.
          </p>
          <p>
            Butonul WhatsApp poate solicita localizarea dispozitivului{' '}
            <strong>doar după ce îl apeși</strong>. Poți refuza permisiunea;
            conversația poate continua fără transmiterea automată a locației.
          </p>

          <h2>3. De ce sunt folosite datele</h2>
          <ul>
            <li>
              pentru a răspunde cererii tale și, dacă alegi, pentru organizarea
              unei intervenții;
            </li>
            <li>
              pentru îndeplinirea obligațiilor legale și gestionarea
              eventualelor reclamații;
            </li>
            <li>
              numai cu acordul tău, pentru măsurarea eficienței reclamelor
              Google și pentru statistici agregate despre accesări și apăsările
              pe Call sau WhatsApp.
            </li>
          </ul>

          <h2>4. Cookie-uri și Google Ads</h2>
          <p>
            Cookie-urile strict necesare permit funcționarea și memorarea
            alegerii tale privind confidențialitatea. Cookie-urile de marketing
            Google Ads nu sunt încărcate până când nu alegi „Accept marketing”.
            Refuzul nu limitează accesul la conținutul sau funcțiile esențiale
            ale site-ului.
          </p>
          <p>
            După acceptare, dashboardul păstrează doar evenimente tehnice
            agregate: pagina accesată, tipul dispozitivului, sursa de campanie
            și faptul că a fost apăsat un buton. Nu stocăm acolo coordonatele
            trimise prin WhatsApp, numărul de telefon, conversațiile sau adresa
            IP.
          </p>
          <p>
            <CookiePreferencesButton className="font-bold text-[#9f6504] underline underline-offset-4">
              Schimbă preferințele cookie
            </CookiePreferencesButton>
            .
          </p>

          <h2>5. Destinatari și transferuri</h2>
          <p>
            În funcție de acțiunea aleasă, mesajele pot fi procesate prin
            WhatsApp, iar datele de măsurare pot fi transmise către Google numai
            dacă ai acceptat categoria de marketing. Detaliile tehnice și orice
            transfer în afara Spațiului Economic European vor fi completate în
            versiunea finală a politicii, pe baza configurației reale a
            serviciilor folosite.
          </p>
          <p>
            Dacă este activată secțiunea de recenzii live, site-ul solicită prin
            server date publice din Google Maps pentru a le afișa cu atribuirea
            cerută de Google. Consultă{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
              politica de confidențialitate Google
            </a>{' '}
            pentru modul în care Google procesează aceste servicii.
          </p>

          <h2>6. Cât timp sunt păstrate datele</h2>
          <p>
            Perioadele de păstrare trebuie stabilite de operator înainte de
            lansare, în funcție de scop, obligații legale și documentele efectiv
            create pentru intervenții. Nu păstrăm în site o bază de date cu
            cereri de tractare în această versiune.
          </p>

          <h2>7. Drepturile tale</h2>
          <p>
            Poți solicita acces la date, rectificare, ștergere, restricționare,
            opoziție sau portabilitate, în condițiile legii. Poți retrage
            oricând acordul pentru cookie-urile de marketing din butonul de
            preferințe. Vei putea depune și o plângere la autoritatea competentă
            pentru protecția datelor.
          </p>

          <h2>8. Contact</h2>
          <p>
            Datele de contact pentru cererile privind protecția datelor se vor
            completa înainte de publicare. Pentru solicitări de intervenție,
            folosește numărul de telefon afișat pe pagina principală.
          </p>
        </div>
      </article>
    </main>
  );
}
