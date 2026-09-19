'use client';

import { type SyntheticEvent, useEffect, useState } from 'react';
import { getUser, handleAuthCallback, login, logout, type User } from '@netlify/identity';

type Metrics = {
  summary: {
    sessions: number;
    pageViews: number;
    callClicks: number;
    whatsappClicks: number;
    whatsappLocationClicks: number;
    callClickRate: number;
  };
  devices: { label: string; value: number }[];
  sources: { label: string; value: number }[];
};

type DashboardUser = Pick<User, 'email' | 'roles'>;

// This is a presentation-only switch for the temporary Netlify test site.
// It never grants access to the real metrics endpoint.
const demoDashboardEnabled = process.env.NEXT_PUBLIC_ADMIN_DEMO_ENABLED === 'true';
const demoCredentials = { email: '1@1.com', password: '1234' };
const demoMetrics: Metrics = {
  summary: {
    sessions: 86,
    pageViews: 112,
    callClicks: 19,
    whatsappClicks: 11,
    whatsappLocationClicks: 7,
    callClickRate: 18.6,
  },
  devices: [
    { label: 'mobile', value: 71 },
    { label: 'desktop', value: 13 },
    { label: 'tablet', value: 2 },
  ],
  sources: [
    { label: 'google', value: 48 },
    { label: 'Direct / necunoscut', value: 31 },
    { label: 'facebook', value: 7 },
  ],
};

const cards: { key: keyof Metrics['summary']; label: string; hint: string }[] = [
  { key: 'sessions', label: 'Sesiuni', hint: 'vizitatori aproximativi, fără identificare' },
  { key: 'callClicks', label: 'Apăsări pe „Sună”', hint: 'intenție de apel, nu apel confirmat' },
  { key: 'whatsappClicks', label: 'Deschideri WhatsApp', hint: 'inclusiv cele cu locație trimisă' },
  { key: 'whatsappLocationClicks', label: 'WhatsApp + locație', hint: 'doar acțiunea, fără coordonate stocate' },
];

function LoginPanel({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await onLogin(email, password);
    } catch {
      setError('Datele de autentificare nu au fost acceptate. Verifică invitația Netlify și rolul de administrator.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="mt-8 grid max-w-md gap-4 rounded-2xl border border-[#dce2e9] bg-white p-6 shadow-[0_14px_42px_rgba(17,34,56,.08)]" onSubmit={submit}>
      <label className="grid gap-1.5 text-sm font-bold text-[#24364d]">
        E-mail invitat
        <input className="min-h-11 rounded-lg border border-[#cbd6e2] bg-white px-3 text-base font-medium outline-none focus:border-[#9f6504] focus:ring-2 focus:ring-[#f7a71b]/30" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className="grid gap-1.5 text-sm font-bold text-[#24364d]">
        Parolă
        <input className="min-h-11 rounded-lg border border-[#cbd6e2] bg-white px-3 text-base font-medium outline-none focus:border-[#9f6504] focus:ring-2 focus:ring-[#f7a71b]/30" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      {error ? <p className="rounded-lg bg-[#fff1ee] p-3 text-sm font-semibold text-[#9a3412]" role="alert">{error}</p> : null}
      <button className="min-h-11 rounded-lg bg-[#0c2035] px-4 text-sm font-extrabold text-white transition hover:bg-[#173a58] disabled:cursor-wait disabled:opacity-60" type="submit" disabled={busy}>
        {busy ? 'Se verifică…' : 'Intră în dashboard'}
      </button>
      <p className="text-xs leading-5 text-[#65788b]">
        {demoDashboardEnabled
          ? 'Mod demo de prezentare: date fictive, fără acces la Netlify sau metrici reale.'
          : 'Conturile sunt doar pe invitație. Nu există înregistrare publică.'}
      </p>
    </form>
  );
}

function Breakdown({ title, values }: { title: string; values: { label: string; value: number }[] }) {
  return (
    <section className="rounded-2xl border border-[#dce2e9] bg-white p-5">
      <h3 className="text-base font-extrabold text-[#1e344b]">{title}</h3>
      {values.length ? (
        <dl className="mt-4 grid gap-3">
          {values.map(({ label, value }) => (
            <div className="flex items-center justify-between gap-4 border-b border-[#edf1f4] pb-3 text-sm last:border-0 last:pb-0" key={label}>
              <dt className="text-[#52657a]">{label}</dt>
              <dd className="font-extrabold text-[#1e344b]">{value}</dd>
            </div>
          ))}
        </dl>
      ) : <p className="mt-4 text-sm text-[#65788b]">Încă nu sunt date în perioada selectată.</p>}
    </section>
  );
}

export function AdminDashboard() {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unauthorized' | 'error'>('loading');
  const [isDemoDashboard, setIsDemoDashboard] = useState(false);

  const loadMetrics = async () => {
    setStatus('loading');
    const response = await fetch('/api/admin/metrics?days=14', { credentials: 'same-origin', cache: 'no-store' });
    if (response.status === 401 || response.status === 403) {
      setStatus('unauthorized');
      return;
    }
    if (!response.ok) {
      setStatus('error');
      return;
    }
    setMetrics((await response.json()) as Metrics);
    setStatus('ready');
  };

  useEffect(() => {
    void (async () => {
      try {
        await handleAuthCallback();
        const currentUser = await getUser();
        setUser(currentUser);
        if (currentUser) await loadMetrics();
        else setStatus('unauthorized');
      } catch {
        setStatus('unauthorized');
      }
    })();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    if (
      demoDashboardEnabled &&
      email === demoCredentials.email &&
      password === demoCredentials.password
    ) {
      setUser({ email, roles: ['admin'] });
      setMetrics(demoMetrics);
      setStatus('ready');
      setIsDemoDashboard(true);
      return;
    }

    await login(email, password);
    window.location.assign('/admin');
  };

  const handleLogout = async () => {
    if (isDemoDashboard) {
      setUser(null);
      setMetrics(null);
      setStatus('unauthorized');
      setIsDemoDashboard(false);
      return;
    }

    await logout();
    window.location.assign('/admin');
  };

  if (!user || status === 'unauthorized') return <LoginPanel onLogin={handleLogin} />;

  return (
    <div className="mt-8">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#dce2e9] bg-white p-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-extrabold text-[#1e344b]">{user.email}</p>
          <p className="mt-1 text-sm text-[#52657a]">
            {isDemoDashboard
              ? 'Demo de prezentare · date fictive, fără acces la metricile reale'
              : 'Ultimele 14 zile · date agregate după acceptarea măsurării'}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-[#cbd6e2] px-4 py-2.5 text-sm font-bold text-[#30465d]" type="button" onClick={() => (isDemoDashboard ? setMetrics(demoMetrics) : void loadMetrics())}>Actualizează</button>
          <button className="rounded-lg bg-[#0c2035] px-4 py-2.5 text-sm font-bold text-white" type="button" onClick={() => void handleLogout()}>Ieși</button>
        </div>
      </div>

      {isDemoDashboard ? (
        <output className="mt-5 block rounded-2xl border border-[#f3c76b] bg-[#fff7e7] p-4 text-[#714b08]">
          <p className="text-sm font-extrabold">DEMO DE PREZENTARE</p>
          <p className="mt-1 text-sm leading-6">Valorile de mai jos sunt exemple pentru client. Nu sunt date despre vizitatori și nu pot fi folosite pentru raportarea Google Ads.</p>
        </output>
      ) : null}

      {status === 'loading' ? <p className="mt-6 text-sm font-semibold text-[#52657a]" aria-live="polite">Se încarcă datele…</p> : null}
      {status === 'error' ? <p className="mt-6 rounded-xl bg-[#fff1ee] p-4 text-sm font-semibold text-[#9a3412]">Datele nu au putut fi încărcate. Verifică dacă Netlify Identity și Netlify Blobs sunt activate pentru acest proiect.</p> : null}
      {metrics ? (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(({ key, label, hint }) => (
              <article key={key} className="rounded-2xl border border-[#dce2e9] bg-white p-5">
                <p className="text-sm font-bold text-[#52657a]">{label}</p>
                <p className="mt-3 text-3xl font-extrabold tracking-[-.04em] text-[#1e344b]">{metrics.summary[key]}</p>
                <p className="mt-2 text-xs leading-5 text-[#65788b]">{hint}</p>
              </article>
            ))}
          </div>
          <section className="mt-5 rounded-2xl bg-[#0c2035] p-6 text-white">
            <p className="text-sm font-bold text-[#ffd06e]">Raport Call → accesare</p>
            <p className="mt-2 text-4xl font-extrabold tracking-[-.05em]">{metrics.summary.callClickRate}%</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">Procentul sesiunilor măsurate care au apăsat butonul „Sună”. Nu reprezintă apeluri confirmate și nu trebuie confundat cu conversiile Google Ads.</p>
          </section>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <Breakdown title="Dispozitive" values={metrics.devices} />
            <Breakdown title="Sursa accesărilor" values={metrics.sources} />
          </div>
        </>
      ) : null}
    </div>
  );
}
