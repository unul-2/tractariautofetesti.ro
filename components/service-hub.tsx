'use client';

import Link from 'next/link';
import { ArrowRight, CarFront, ScanLine, Tractor, Wrench } from 'lucide-react';
import { serviceCatalog, serviceOrder, type Language, type ServiceKey } from '@/lib/services';

const icons: Record<ServiceKey, typeof Wrench> = {
  'mobile-service': Wrench,
  obd: ScanLine,
  'vehicle-transport': CarFront,
  'equipment-transport': Tractor,
};

export function ServiceHub({ language }: { language: Language }) {
  return (
    <section className="border-y border-[#dce3e9] bg-[#eef3f6] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
          <div>
            <p className="section-kicker">
              {language === 'ro' ? 'Mai mult decât tractare' : 'More than recovery'}
            </p>
            <h2 className="section-title max-w-xl">
              {language === 'ro'
                ? 'Intervenții mobile și transport programat.'
                : 'Mobile assistance and scheduled transport.'}
            </h2>
          </div>
          <p className="section-copy lg:ml-auto lg:max-w-xl">
            {language === 'ro'
              ? 'Tractarea rămâne serviciul principal pentru urgențe. Pentru probleme care pot fi verificate pe loc sau pentru transporturi planificate, avem trasee separate și informație clară.'
              : 'Recovery remains the primary emergency service. For problems that can be checked on site or planned transport, we provide separate, clearer service paths.'}
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {serviceOrder.map((key) => {
            const service = serviceCatalog[key];
            const content = service[language];
            const Icon = icons[key];

            return (
              <Link
                key={key}
                href={service.href}
                className="group relative overflow-hidden rounded-[1.6rem] border border-[#d5dee6] bg-white p-6 shadow-[0_14px_42px_rgba(13,34,52,.05)] transition hover:-translate-y-1 hover:border-[#c3ced8] hover:shadow-[0_20px_52px_rgba(13,34,52,.09)] sm:p-7"
              >
                <div className="flex items-start justify-between gap-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#0b2235] text-[#ffd36f] transition group-hover:bg-[#f6a817] group-hover:text-[#071827]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <ArrowRight className="h-5 w-5 text-[#8a9aaa] transition group-hover:translate-x-1 group-hover:text-[#a46600]" aria-hidden="true" />
                </div>
                <p className="mt-6 text-[11px] font-black uppercase tracking-[.13em] text-[#a46600]">
                  {content.eyebrow}
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-[-.04em] text-[#102235]">
                  {content.shortTitle}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#607183]">
                  {content.summary}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#193851]">
                  {language === 'ro' ? 'Vezi serviciul' : 'View service'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-6 max-w-4xl text-xs leading-5 text-[#718294]">
          {language === 'ro'
            ? 'Disponibilitatea, capacitatea tehnică și costul se confirmă înainte de plecare. Pentru transporturile grele sau speciale putem folosi colaboratori potriviți cazului.'
            : 'Availability, technical capability and cost are confirmed before departure. Heavy or specialist transport may be facilitated through a suitable transport partner.'}
        </p>
      </div>
    </section>
  );
}
