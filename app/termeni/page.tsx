import Link from 'next/link';

export const metadata = {
  title: 'Termeni de utilizare | Tractări Auto Fetești',
  description: 'Condiții de utilizare a site-ului Tractări Auto Fetești.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#112238]">
      <header className="border-b border-[#dce2e9] bg-white">
        <div className="mx-auto flex max-w-4xl items-center px-5 py-5 sm:px-8">
          <Link href="/" className="text-sm font-extrabold">
            ← Tractări Auto Fetești
          </Link>
        </div>
      </header>
      <article className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-24">
        <p className="section-kicker">Informații legale</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-[-.045em] sm:text-5xl">
          Termeni de utilizare
        </h1>
        <div className="prose mt-10 max-w-none prose-slate prose-headings:font-extrabold prose-p:leading-7">
          <h2>Scopul site-ului</h2>
          <p>
            Site-ul prezintă servicii de tractare și asistență rutieră și oferă
            canale directe de contact. Informațiile de pe site nu reprezintă
            automat o confirmare de disponibilitate sau o ofertă contractuală
            fermă.
          </p>

          <h2>Confirmarea unei intervenții</h2>
          <p>
            O intervenție se confirmă direct prin telefon sau în conversația
            inițiată de utilizator. Înainte de plecare se clarifică
            disponibilitatea, locația, tipul vehiculului, destinația și costul
            aplicabil situației concrete.
          </p>

          <h2>Siguranță</h2>
          <p>
            Dacă există pericol imediat, accident cu victime, incendiu ori orice
            urgență care necesită autorități, apelează 112. Nu folosi site-ul
            pentru a transmite informații sensibile de care nu este nevoie
            pentru solicitarea de asistență.
          </p>

          <h2>Informații afișate</h2>
          <p>
            Aria de acoperire și lista de servicii sunt informative și se
            confirmă pentru fiecare caz. Nu publicăm promisiuni de timp, prețuri
            sau statistici fără confirmarea operatorului.
          </p>

          <h2>Modificări</h2>
          <p>
            Operatorul poate actualiza aceste pagini atunci când se modifică
            serviciile, datele de contact sau modul de prelucrare a datelor.
            Versiunea finală va include identitatea legală a operatorului și
            data ultimei actualizări.
          </p>
        </div>
      </article>
    </main>
  );
}
