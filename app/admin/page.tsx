import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminDashboard } from '@/components/admin-dashboard';

export const metadata: Metadata = {
  title: 'Administrare metrici | Tractări Auto Fetești',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#112238]">
      <header className="border-b border-[#dce2e9] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Link href="/" className="text-sm font-extrabold">← Tractări Auto Fetești</Link>
          <span className="rounded-full bg-[#eaf0f5] px-3 py-1 text-xs font-extrabold text-[#30465d]">Administrare privată</span>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
        <p className="section-kicker">Dashboard</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[-.05em] sm:text-5xl">Ce se întâmplă pe site, pe înțeles.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#52657a]">Aici vedem doar metrici aggregate pentru comparația cu Google Ads: accesări, tipul dispozitivului și apăsările pe Call sau WhatsApp. Nu stocăm locația exactă, numere de telefon, conversații sau IP-uri.</p>
        <AdminDashboard />
      </section>
    </main>
  );
}
