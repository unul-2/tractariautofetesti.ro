'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

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

const fallbackGoogleMapsUrl =
  'https://www.google.com/maps/place/Tractari+Auto/@44.3732589,27.8391185,17z/data=!4m8!3m7!1s0x40b071ea7db3ce0b:0xbe0630d2e820814a!8m2!3d44.3732589!4d27.8391185!9m1!1b1!16s%2Fg%2F11xn6j9csd';

function Stars({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating.toFixed(1)} din 5 stele`} className="tracking-[.12em] text-[#dc8d09]">
      {'★★★★★'}
    </span>
  );
}

export function GoogleReviews() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<GoogleReviewsPayload | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'unavailable'>('idle');

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || state !== 'idle') return;
        setState('loading');
        observer.disconnect();

        void fetch('/api/google-reviews', { credentials: 'same-origin', cache: 'no-store' })
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
    <div ref={containerRef} className="rounded-3xl border border-[#dce2e9] bg-white p-6 shadow-[0_18px_55px_rgba(17,34,56,.07)] sm:p-9">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          <p className="section-kicker">Recenzii</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">
            Opinii actualizate din Google Maps
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#52657a]">
            Afișăm ratingul curent și cele mai relevante opinii furnizate de Google. Pentru toate recenziile și detalii, deschide profilul oficial.
          </p>
        </div>
        <a
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#0c2035] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#173a58]"
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          Vezi pe Google Maps ↗
        </a>
      </div>

      {state === 'ready' && data ? (
        <>
          <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-[#e2e8ef] py-5">
            <span className="text-3xl font-extrabold tracking-[-.04em]">{data.rating.toLocaleString('ro-RO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
            <Stars rating={data.rating} />
            <span className="text-sm font-semibold text-[#52657a]">din {data.reviewCount} recenzii Google</span>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {data.reviews.slice(0, 3).map((review) => (
              <article key={review.sourceUrl} className="rounded-2xl bg-[#f7f8fa] p-5">
                <div className="flex items-center gap-3">
                  {review.author.photoUrl ? (
                    <Image
                      alt={`Avatar ${review.author.name}`}
                      className="h-9 w-9 rounded-full bg-[#dce2e9] object-cover"
                      height={36}
                      referrerPolicy="no-referrer"
                      src={review.author.photoUrl}
                      unoptimized
                      width={36}
                    />
                  ) : (
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#dce2e9] text-xs font-black text-[#30465d]" aria-hidden="true">
                      {review.author.name.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    {review.author.profileUrl ? (
                      <a className="block truncate text-sm font-extrabold text-[#1e344b] hover:underline" href={review.author.profileUrl} target="_blank" rel="noreferrer">
                        {review.author.name}
                      </a>
                    ) : (
                      <p className="truncate text-sm font-extrabold text-[#1e344b]">{review.author.name}</p>
                    )}
                    <p className="mt-0.5 text-xs text-[#65788b]">{review.published}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <Stars rating={review.rating} />
                  <a className="text-xs font-bold text-[#9f6504] underline underline-offset-4" href={review.sourceUrl} target="_blank" rel="noreferrer">
                    Sursa
                  </a>
                </div>
                <p className="mt-3 line-clamp-6 text-sm leading-6 text-[#40556b]">{review.text}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-[#65788b]">
            Recenziile sunt furnizate de Google Maps și sunt afișate în ordinea de relevanță furnizată de Google. Google Maps
          </p>
        </>
      ) : state === 'loading' ? (
        <div className="mt-7 grid gap-4 lg:grid-cols-3" aria-live="polite">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-48 animate-pulse rounded-2xl bg-[#eef2f5]" />
          ))}
        </div>
      ) : (
        <div className="mt-7 rounded-2xl bg-[#f7f8fa] p-5 text-sm leading-6 text-[#52657a]">
          Recenziile live se activează imediat ce este conectat proiectul Google Maps al firmei. Până atunci, profilul oficial rămâne disponibil prin butonul de mai sus.
        </div>
      )}
    </div>
  );
}
