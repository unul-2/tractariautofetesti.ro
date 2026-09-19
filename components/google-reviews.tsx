'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, BadgeCheck, Star } from 'lucide-react';

type Language = 'ro' | 'en';

type Review = {
  author: {
    name: string;
    profileUrl?: string;
    photoUrl?: string;
  };
  rating: number;
  text: string;
  published: string;
  sourceUrl: string;
};

type GoogleReviewsPayload = {
  rating: number;
  reviewCount: number;
  sourceUrl: string;
  reviews: Review[];
};

const copy = {
  ro: {
    ariaStars: (rating: number) => `${rating.toFixed(1)} din 5 stele`,
    kicker: 'Recenzii Google',
    title: 'Încrederea se verifică.',
    intro:
      'Ratingul și opiniile sunt solicitate din Google Maps. Păstrăm autorul, sursa și accesul către profilul original.',
    reviewCount: 'recenzii Google',
    profile: 'Vezi profilul Google',
    supplied: 'Opinii furnizate de Google Maps',
    source: 'Sursa',
    footnote:
      'Recenziile sunt afișate în ordinea de relevanță furnizată de Google. Pentru lista completă, folosește profilul Google Maps.',
    unavailable:
      'Recenziile live se afișează când conexiunea Google Maps este disponibilă. Profilul oficial rămâne accesibil prin butonul din stânga.',
  },
  en: {
    ariaStars: (rating: number) => `${rating.toFixed(1)} out of 5 stars`,
    kicker: 'Google reviews',
    title: 'Trust should be verifiable.',
    intro:
      'Ratings and reviews are requested from Google Maps. We keep the author, source and direct access to the original profile.',
    reviewCount: 'Google reviews',
    profile: 'View Google profile',
    supplied: 'Reviews provided by Google Maps',
    source: 'Source',
    footnote:
      'Reviews are shown in the relevance order provided by Google. Use the Google Maps profile for the complete list.',
    unavailable:
      'Live reviews appear when the Google Maps connection is available. The official profile remains accessible from the button on the left.',
  },
} as const;

const fallbackGoogleMapsUrl =
  'https://www.google.com/maps/place/Tractari+Auto/@44.3732589,27.8391185,17z/data=!4m8!3m7!1s0x40b071ea7db3ce0b:0xbe0630d2e820814a!8m2!3d44.3732589!4d27.8391185!9m1!1b1!16s%2Fg%2F11xn6j9csd';

function Stars({ rating, language }: { rating: number; language: Language }) {
  const rounded = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <span
      aria-label={copy[language].ariaStars(rating)}
      className="inline-flex gap-0.5 text-[#d98c08]"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < rounded ? 'fill-current' : 'opacity-25'}`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export function GoogleReviews({ language = 'ro' }: { language?: Language }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<GoogleReviewsPayload | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'unavailable'>('idle');
  const t = copy[language];

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || state !== 'idle') return;
        setState('loading');
        observer.disconnect();

        void fetch('/api/google-reviews', {
          credentials: 'same-origin',
          cache: 'no-store',
        })
          .then(async (response) => {
            if (!response.ok) throw new Error('Reviews unavailable');
            return (await response.json()) as GoogleReviewsPayload;
          })
          .then((payload) => {
            setData(payload);
            setState('ready');
          })
          .catch(() => setState('unavailable'));
      },
      { rootMargin: '220px 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [state]);

  const sourceUrl = data?.sourceUrl ?? fallbackGoogleMapsUrl;

  return (
    <div
      ref={containerRef}
      className="overflow-hidden rounded-[2rem] border border-[#d6dfe7] bg-white shadow-[0_24px_65px_rgba(13,34,52,.07)]"
    >
      <div className="grid lg:grid-cols-[.82fr_1.18fr]">
        <div className="relative overflow-hidden bg-[#0b2235] p-7 text-white sm:p-10 lg:p-12">
          <div
            className="absolute -left-20 top-12 h-56 w-56 rounded-full bg-[#f6a817]/15 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <p className="section-kicker text-[#ffd36f]">{t.kicker}</p>
            <h2 className="mt-4 text-4xl font-black leading-[1.02] tracking-[-.05em] sm:text-5xl">
              {t.title}
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-6 text-white/60">{t.intro}</p>

            {state === 'ready' && data ? (
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[.055] p-5">
                <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                  <span className="text-5xl font-black tracking-[-.06em] text-[#ffd36f]">
                    {data.rating.toLocaleString(language === 'ro' ? 'ro-RO' : 'en-GB', {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                  </span>
                  <div className="pb-1">
                    <Stars rating={data.rating} language={language} />
                    <p className="mt-1 text-xs font-bold text-white/48">
                      {data.reviewCount} {t.reviewCount}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <a
              className="group mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#f6a817] px-5 text-sm font-black text-[#071827] transition hover:bg-[#ffc451]"
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              {t.profile}
              <ArrowRight
                className="h-4 w-4 transition group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          {state === 'ready' && data ? (
            <>
              <div className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[.1em] text-[#607183]">
                <BadgeCheck className="h-4 w-4 text-[#a46600]" aria-hidden="true" />
                {t.supplied}
              </div>
              <div className="grid gap-4 xl:grid-cols-3">
                {data.reviews.slice(0, 3).map((review) => (
                  <article
                    key={review.sourceUrl}
                    className="group rounded-2xl border border-[#e1e7ec] bg-[#f7f9fa] p-5 transition hover:-translate-y-1 hover:border-[#d1dbe3] hover:bg-white hover:shadow-[0_16px_38px_rgba(13,34,52,.07)]"
                  >
                    <div className="flex items-center gap-3">
                      {review.author.photoUrl ? (
                        <Image
                          alt={`Avatar ${review.author.name}`}
                          className="h-10 w-10 rounded-full bg-[#dce2e9] object-cover"
                          height={40}
                          referrerPolicy="no-referrer"
                          src={review.author.photoUrl}
                          unoptimized
                          width={40}
                        />
                      ) : (
                        <span
                          className="grid h-10 w-10 place-items-center rounded-full bg-[#0b2235] text-xs font-black text-[#ffd36f]"
                          aria-hidden="true"
                        >
                          {review.author.name.slice(0, 1).toUpperCase()}
                        </span>
                      )}

                      <div className="min-w-0">
                        {review.author.profileUrl ? (
                          <a
                            className="block truncate text-sm font-black text-[#1e344b] hover:underline"
                            href={review.author.profileUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {review.author.name}
                          </a>
                        ) : (
                          <p className="truncate text-sm font-black text-[#1e344b]">
                            {review.author.name}
                          </p>
                        )}
                        <p className="mt-0.5 text-xs text-[#718294]">{review.published}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <Stars rating={review.rating} language={language} />
                      <a
                        className="text-xs font-black text-[#9a6205] underline underline-offset-4"
                        href={review.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t.source}
                      </a>
                    </div>

                    <p className="mt-4 line-clamp-6 text-sm leading-6 text-[#52677b]">
                      {review.text}
                    </p>
                  </article>
                ))}
              </div>
              <p className="mt-5 text-xs leading-5 text-[#718294]">{t.footnote}</p>
            </>
          ) : state === 'loading' || state === 'idle' ? (
            <div className="grid gap-4 xl:grid-cols-3" aria-live="polite">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-56 animate-pulse rounded-2xl bg-[#edf1f4]"
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-64 items-center rounded-2xl border border-[#e1e7ec] bg-[#f7f9fa] p-6 text-sm leading-6 text-[#607183]">
              {t.unavailable}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
