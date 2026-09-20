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

type GoogleAdsPayload = {
  connected: boolean;
  days: number;
  missingConfiguration: string[];
  connectionError?: string;
  requestId?: string | null;
  edit: {
    securityConfigured: boolean;
    writeEnabled: boolean;
    active: boolean;
    expiresAt: string | null;
  };
  report: {
    range: { start: string; end: string };
    customer: string;
    summary: {
      impressions: number;
      clicks: number;
      ctr: number;
      costRon: number;
      averageCpcRon: number;
      conversions: number;
      costPerConversionRon: number;
      phoneCalls: number;
      phoneImpressions: number;
    };
    campaigns: {
      id: string;
      name: string;
      status: string;
      dailyBudgetRon: number;
      budgetResourceName: string | null;
      impressions: number;
      clicks: number;
      ctr: number;
      costRon: number;
      averageCpcRon: number;
      conversions: number;
      phoneCalls: number;
      phoneImpressions: number;
    }[];
  } | null;
};

type AuditEvent = {
  storedAt: string;
  actorHash: string;
  action: string;
  details: Record<string, unknown>;
};

type AuditPayload = {
  days: number;
  count: number;
  events: AuditEvent[];
};

type DashboardUser = Pick<User, 'email' | 'roles'>;

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

function ron(value: number) {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
    maximumFractionDigits: 2,
  }).format(value);
}

function number(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat('ro-RO', { maximumFractionDigits }).format(value);
}

export function AdminDashboard() {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [ads, setAds] = useState<GoogleAdsPayload | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unauthorized' | 'error'>('loading');
  const [adsStatus, setAdsStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [isDemoDashboard, setIsDemoDashboard] = useState(false);
  const [pin, setPin] = useState('');
  const [pinBusy, setPinBusy] = useState(false);
  const [pinMessage, setPinMessage] = useState<string | null>(null);
  const [days, setDays] = useState<7 | 14 | 30>(14);
  const [audit, setAudit] = useState<AuditPayload | null>(null);
  const [auditStatus, setAuditStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  const loadMetrics = async (selectedDays = days) => {
    setStatus('loading');
    const response = await fetch(`/api/admin/metrics?days=${selectedDays}`, { credentials: 'same-origin', cache: 'no-store' });
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

  const loadAds = async (selectedDays = days) => {
    setAdsStatus('loading');
    const response = await fetch(`/api/admin/google-ads?days=${selectedDays}`, {
      credentials: 'same-origin',
      cache: 'no-store',
    });
    const payload = (await response.json().catch(() => null)) as GoogleAdsPayload | null;
    if (payload) setAds(payload);
    setAdsStatus(response.ok || response.status === 502 ? 'ready' : 'error');
  };

  const loadAudit = async () => {
    setAuditStatus('loading');
    const response = await fetch('/api/admin/google-ads/audit?days=30&limit=30', {
      credentials: 'same-origin',
      cache: 'no-store',
    });
    if (!response.ok) {
      setAuditStatus('error');
      return;
    }
    setAudit((await response.json()) as AuditPayload);
    setAuditStatus('ready');
  };

  const refreshAll = async (selectedDays = days) => {
    if (isDemoDashboard) {
      setMetrics(demoMetrics);
      return;
    }
    await Promise.all([loadMetrics(selectedDays), loadAds(selectedDays), loadAudit()]);
  };

  const changePeriod = async (selectedDays: 7 | 14 | 30) => {
    setDays(selectedDays);
    if (!isDemoDashboard) {
      await Promise.all([loadMetrics(selectedDays), loadAds(selectedDays)]);
    }
  };

  useEffect(() => {
    void (async () => {
      try {
        await handleAuthCallback();
        const currentUser = await getUser();
        setUser(currentUser);
        if (currentUser) await Promise.all([loadMetrics(14), loadAds(14), loadAudit()]);
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
      setAdsStatus('idle');
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
      setAds(null);
      setStatus('unauthorized');
      setAdsStatus('idle');
      setIsDemoDashboard(false);
      return;
    }

    await logout();
    window.location.assign('/admin');
  };

  const unlockAdsEdit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPinBusy(true);
    setPinMessage(null);

    try {
      const response = await fetch('/api/admin/google-ads/unlock', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        reason?: string;
        attemptsRemaining?: number;
        lockUntil?: string;
      };

      if (!response.ok || !payload.ok) {
        if (payload.reason === 'locked') {
          setPinMessage('Prea multe încercări. Edit Mode este blocat temporar 15 minute.');
        } else if (payload.reason === 'not_configured') {
          setPinMessage('Protecția PIN nu este încă configurată în variabilele securizate Netlify.');
        } else {
          setPinMessage(`PIN incorect. Încercări rămase: ${payload.attemptsRemaining ?? '—'}.`);
        }
        return;
      }

      setPin('');
      setPinMessage('Edit Mode deblocat temporar.');
      await Promise.all([loadAds(), loadAudit()]);
    } finally {
      setPinBusy(false);
    }
  };

  const lockAdsEdit = async () => {
    setPinBusy(true);
    setPinMessage(null);
    try {
      await fetch('/api/admin/google-ads/lock', {
        method: 'POST',
        credentials: 'same-origin',
      });
      setPinMessage('Edit Mode blocat.');
      await Promise.all([loadAds(), loadAudit()]);
    } finally {
      setPinBusy(false);
    }
  };

  if (!user || status === 'unauthorized') return <LoginPanel onLogin={handleLogin} />;

  const googleSessions = metrics?.sources.find((source) =>
    source.label.toLowerCase().includes('google'),
  )?.value ?? 0;

  return (
    <div className="mt-8">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#dce2e9] bg-white p-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-extrabold text-[#1e344b]">{user.email}</p>
          <p className="mt-1 text-sm text-[#52657a]">
            {isDemoDashboard
              ? 'Demo de prezentare · date fictive, fără acces la metricile reale'
              : `Ultimele ${days} zile · site + Google Ads în același dashboard`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-[#cbd6e2] bg-[#f7f9fa] p-1" aria-label="Perioadă raport">
            {([7, 14, 30] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => void changePeriod(value)}
                className={`rounded-md px-3 py-1.5 text-xs font-extrabold transition ${
                  days === value ? 'bg-[#0c2035] text-white' : 'text-[#52657a] hover:bg-white'
                }`}
              >
                {value} zile
              </button>
            ))}
          </div>
          <button className="rounded-lg border border-[#cbd6e2] px-4 py-2.5 text-sm font-bold text-[#30465d]" type="button" onClick={() => void refreshAll()}>Actualizează</button>
          <button className="rounded-lg bg-[#0c2035] px-4 py-2.5 text-sm font-bold text-white" type="button" onClick={() => void handleLogout()}>Ieși</button>
        </div>
      </div>

      {isDemoDashboard ? (
        <output className="mt-5 block rounded-2xl border border-[#f3c76b] bg-[#fff7e7] p-4 text-[#714b08]">
          <p className="text-sm font-extrabold">DEMO DE PREZENTARE</p>
          <p className="mt-1 text-sm leading-6">Valorile de mai jos sunt exemple pentru client. Nu sunt date despre vizitatori și nu pot fi folosite pentru raportarea Google Ads.</p>
        </output>
      ) : null}

      {status === 'loading' ? <p className="mt-6 text-sm font-semibold text-[#52657a]" aria-live="polite">Se încarcă datele site-ului…</p> : null}
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

      <section className="mt-8 overflow-hidden rounded-[1.75rem] border border-[#cfd9e3] bg-white shadow-[0_18px_50px_rgba(13,34,52,.06)]">
        <div className="flex flex-col justify-between gap-4 bg-[#081b2c] p-6 text-white sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#f6b62e]">Google Ads</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-.04em]">Campanie + conversii</h2>
            <p className="mt-2 text-sm text-white/60">Citire implicită. Orice modificare cere autentificarea admin + PIN temporar.</p>
          </div>
          <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-extrabold uppercase tracking-[.1em] ${
            ads?.edit.active
              ? 'bg-[#dff7e8] text-[#17623b]'
              : 'bg-white/10 text-white/72'
          }`}>
            {ads?.edit.active ? 'Edit session' : 'Read only'}
          </span>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.35fr_.65fr]">
          <div>
            {isDemoDashboard ? (
              <p className="rounded-xl bg-[#f4f6f8] p-4 text-sm leading-6 text-[#607183]">Google Ads nu este accesat în modul demo.</p>
            ) : adsStatus === 'loading' ? (
              <p className="text-sm font-semibold text-[#52657a]">Se citesc datele Google Ads…</p>
            ) : adsStatus === 'error' && !ads ? (
              <p className="rounded-xl bg-[#fff1ee] p-4 text-sm font-semibold text-[#9a3412]">Endpointul Google Ads nu a putut fi încărcat.</p>
            ) : ads && !ads.connected ? (
              <div className="rounded-2xl border border-[#dce2e9] bg-[#f7f9fa] p-5">
                <p className="font-extrabold text-[#1e344b]">Conector pregătit · încă neconectat</p>
                <p className="mt-2 text-sm leading-6 text-[#607183]">
                  {ads.connectionError
                    ? ads.connectionError
                    : 'Lipsesc credentialele Google Ads din variabilele securizate Netlify. Site-ul și dashboardul rămân funcționale.'}
                </p>
                {ads.requestId ? <p className="mt-2 text-xs text-[#718294]">Google request ID: {ads.requestId}</p> : null}
              </div>
            ) : ads?.report ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {[
                    ['Cheltuit', ron(ads.report.summary.costRon)],
                    ['Clickuri', number(ads.report.summary.clicks)],
                    ['Afișări', number(ads.report.summary.impressions)],
                    ['CTR', `${number(ads.report.summary.ctr, 2)}%`],
                    ['Conversii', number(ads.report.summary.conversions, 1)],
                    ['Apeluri Ads', number(ads.report.summary.phoneCalls)],
                  ].map(([label, value]) => (
                    <article key={label} className="rounded-xl border border-[#dce2e9] bg-[#f8fafb] p-4">
                      <p className="text-xs font-bold uppercase tracking-[.08em] text-[#718294]">{label}</p>
                      <p className="mt-2 text-2xl font-extrabold tracking-[-.04em] text-[#1e344b]">{value}</p>
                    </article>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-[#ead8ae] bg-[#fff9eb] p-4">
                  <p className="text-sm font-extrabold text-[#714b08]">Ads → site, ultimele {days} zile</p>
                  <p className="mt-1 text-sm leading-6 text-[#7c6334]">
                    {number(ads.report.summary.clicks)} clickuri Google Ads · {googleSessions} sesiuni măsurate cu sursă Google · {metrics?.summary.callClicks ?? 0} apăsări pe „Sună” pe site.
                  </p>
                </div>

                <div className="mt-5 grid gap-3">
                  {ads.report.campaigns.map((campaign) => (
                    <article key={campaign.id} className="rounded-xl border border-[#dce2e9] p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-extrabold text-[#1e344b]">{campaign.name}</p>
                          <p className="mt-1 text-xs text-[#718294]">ID {campaign.id} · buget {ron(campaign.dailyBudgetRon)}/zi</p>
                        </div>
                        <span className="rounded-full bg-[#eef2f5] px-2.5 py-1 text-[11px] font-extrabold text-[#52657a]">{campaign.status}</span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                        <span>Cost <strong>{ron(campaign.costRon)}</strong></span>
                        <span>Click <strong>{number(campaign.clicks)}</strong></span>
                        <span>Conv. <strong>{number(campaign.conversions, 1)}</strong></span>
                        <span>Apeluri <strong>{number(campaign.phoneCalls)}</strong></span>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : null}
          </div>

          <aside className="rounded-2xl border border-[#dce2e9] bg-[#f7f9fa] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[.1em] text-[#718294]">Layer securizat</p>
                <h3 className="mt-1 text-lg font-extrabold text-[#1e344b]">Modificări Google Ads</h3>
              </div>
              <span className="text-xl" aria-hidden="true">{ads?.edit.active ? '🔓' : '🔒'}</span>
            </div>

            {!ads?.edit.securityConfigured ? (
              <p className="mt-4 rounded-xl border border-[#ead8ae] bg-[#fff9eb] p-3 text-sm leading-6 text-[#714b08]">
                Protecția este implementată, dar PIN-ul și cheia de sesiune trebuie introduse ca variabile secrete Netlify.
              </p>
            ) : ads.edit.active ? (
              <div className="mt-4">
                <p className="rounded-xl border border-[#b9e5ca] bg-[#effbf4] p-3 text-sm font-semibold leading-6 text-[#17623b]">
                  Edit Mode deblocat până la {ads.edit.expiresAt ? new Date(ads.edit.expiresAt).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }) : 'expirarea sesiunii'}.
                </p>
                <button type="button" disabled={pinBusy} onClick={() => void lockAdsEdit()} className="mt-3 min-h-11 w-full rounded-lg border border-[#cbd6e2] bg-white px-4 text-sm font-extrabold text-[#30465d]">
                  Blochează acum
                </button>
              </div>
            ) : (
              <form className="mt-4 grid gap-3" onSubmit={unlockAdsEdit}>
                <label className="grid gap-1.5 text-sm font-bold text-[#30465d]">
                  PIN 4 cifre
                  <input
                    type="password"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={4}
                    pattern="[0-9]{4}"
                    required
                    value={pin}
                    onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="min-h-12 rounded-lg border border-[#cbd6e2] bg-white px-4 text-center text-xl font-extrabold tracking-[.35em] outline-none focus:border-[#9f6504] focus:ring-2 focus:ring-[#f7a71b]/30"
                  />
                </label>
                <button type="submit" disabled={pinBusy || pin.length !== 4} className="min-h-11 rounded-lg bg-[#0c2035] px-4 text-sm font-extrabold text-white disabled:opacity-50">
                  {pinBusy ? 'Se verifică…' : 'Deblochează 15 minute'}
                </button>
              </form>
            )}

            {pinMessage ? <output className="mt-3 block text-xs font-semibold leading-5 text-[#52657a]">{pinMessage}</output> : null}

            <div className="mt-5 border-t border-[#dce2e9] pt-4 text-xs leading-5 text-[#65788b]">
              <p><strong>5 încercări</strong> înainte de blocare temporară.</p>
              <p className="mt-1"><strong>15 minute</strong> durată maximă pentru sesiunea ridicată.</p>
              <p className="mt-1">Operațiile sunt auditate fără stocarea PIN-ului.</p>
              <p className="mt-1">
                Write API: <strong>{ads?.edit.writeEnabled ? 'activat' : 'oprit global'}</strong>.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {!isDemoDashboard ? (
        <section className="mt-8 rounded-[1.75rem] border border-[#cfd9e3] bg-white p-6 shadow-[0_18px_50px_rgba(13,34,52,.05)]">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#9f6504]">Readiness + audit</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-[-.04em] text-[#1e344b]">Starea integrării Google Ads</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#607183]">
                Putem verifica partea de securitate și infrastructură chiar înainte să conectăm credentialele Google.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loadAudit()}
              className="rounded-lg border border-[#cbd6e2] px-4 py-2.5 text-sm font-bold text-[#30465d]"
            >
              Reîncarcă auditul
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Admin Identity', 'Activ', true],
              ['Google Ads API', ads?.connected ? 'Conectat' : 'Neconectat', Boolean(ads?.connected)],
              ['PIN security', ads?.edit.securityConfigured ? 'Configurat' : 'În așteptare', Boolean(ads?.edit.securityConfigured)],
              ['Write switch', ads?.edit.writeEnabled ? 'ACTIV' : 'OPRIT', !ads?.edit.writeEnabled],
            ].map(([label, value, ok]) => (
              <article key={String(label)} className="rounded-xl border border-[#dce2e9] bg-[#f8fafb] p-4">
                <p className="text-xs font-bold uppercase tracking-[.08em] text-[#718294]">{label}</p>
                <p className={`mt-2 text-base font-extrabold ${ok ? 'text-[#17623b]' : 'text-[#8a5a08]'}`}>
                  {value}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 border-t border-[#e6ebef] pt-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-[#1e344b]">Jurnal securitate Ads</h3>
                <p className="mt-1 text-xs text-[#718294]">Ultimele evenimente din 30 zile. PIN-ul și secretele nu sunt stocate.</p>
              </div>
              {audit ? <span className="text-xs font-bold text-[#718294]">{audit.count} evenimente</span> : null}
            </div>

            {auditStatus === 'loading' ? (
              <p className="mt-4 text-sm text-[#607183]">Se încarcă auditul…</p>
            ) : auditStatus === 'error' ? (
              <p className="mt-4 rounded-xl bg-[#fff1ee] p-4 text-sm font-semibold text-[#9a3412]">Auditul nu a putut fi citit.</p>
            ) : audit?.events.length ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-[#dce2e9]">
                {audit.events.map((event) => (
                  <div key={`${event.storedAt}-${event.action}`} className="grid gap-1 border-b border-[#edf1f4] px-4 py-3 text-sm last:border-b-0 sm:grid-cols-[170px_1fr_auto] sm:items-center sm:gap-4">
                    <time className="text-xs font-semibold text-[#718294]" dateTime={event.storedAt}>
                      {new Date(event.storedAt).toLocaleString('ro-RO', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                    <span className="font-bold text-[#30465d]">
                      {event.action.replaceAll('_', ' ')}
                    </span>
                    <span className="text-[11px] font-semibold text-[#8a98a7]">
                      admin {event.actorHash.slice(0, 8)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-xl bg-[#f7f9fa] p-4 text-sm text-[#607183]">
                Nu există încă evenimente Ads. După configurarea PIN-ului, încercările de unlock și modificările vor apărea aici.
              </p>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
