'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Cinematic tow truck journey: from the distant motorway photograph,
 * across the page, to a close-up arrival at the final road scene.
 * Decorative only: phone/WhatsApp hit targets remain untouched.
 */
export function TowTruckCinematic() {
  const vehicleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const truck = vehicleRef.current;
    const page = document.querySelector<HTMLElement>('[data-motion-root]');
    const destination = document.getElementById('sosire');
    const footer = page?.querySelector('footer');
    const overlay = truck?.parentElement;
    const turningTruck = truck?.querySelector<HTMLElement>('.cinematic-vehicle-turn');
    const frontPhoto = destination?.querySelector<HTMLElement>('.cinematic-arrival-front');
    if (!truck || !page || !destination || !footer || !overlay || !turningTruck || !frontPhoto) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const matches = gsap.matchMedia();

    matches.add(
      {
        compact: '(max-width: 767px)',
        spacious: '(min-width: 768px)',
      },
      (context) => {
        const compact = Boolean(context.conditions?.compact);
        const width = () =>
          compact ? Math.min(window.innerWidth * 0.82, 420) : Math.min(window.innerWidth * 0.46, 740);
        const height = () => width() * (509 / 996);
        const position = (x: number, y: number) => ({
          x: () => window.innerWidth * x - width() * 0.5,
          y: () => window.innerHeight * y - height() * 0.5,
        });

        const sequence = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: page,
            start: 'top top',
            endTrigger: destination,
            end: 'bottom bottom',
            scrub: compact ? 0.65 : 1.25,
            invalidateOnRefresh: true,
          },
        });

        sequence
          .fromTo(
            truck,
            {
              ...position(compact ? 0.88 : 0.91, 0.58),
              scale: compact ? 0.27 : 0.31,
              rotation: -2.5,
              autoAlpha: 0,
            },
            {
              ...position(compact ? 0.87 : 0.83, 0.47),
              scale: compact ? 0.39 : 0.49,
              rotation: -1,
              autoAlpha: compact ? 0.12 : 0.28,
              duration: 0.16,
            },
          )
          .to(truck, {
            ...position(compact ? 0.84 : 0.8, 0.58),
            scale: compact ? 0.57 : 0.76,
            rotation: 1.2,
            autoAlpha: compact ? 0.17 : 0.4,
            duration: 0.22,
          })
          .to(truck, {
            ...position(compact ? 0.88 : 0.76, 0.46),
            scale: compact ? 0.71 : 0.96,
            rotation: -0.9,
            autoAlpha: compact ? 0.13 : 0.26,
            duration: 0.22,
          })
          .to(truck, {
            ...position(compact ? 0.84 : 0.73, 0.6),
            scale: compact ? 0.93 : 1.18,
            rotation: 1.4,
            autoAlpha: compact ? 0.22 : 0.5,
            duration: 0.21,
          })
          .to(truck, {
            ...position(compact ? 0.75 : 0.91, compact ? 0.77 : 0.62),
            scale: compact ? 1.3 : 1.66,
            rotation: 0,
            autoAlpha: compact ? 0.58 : 0.94,
            duration: 0.19,
          });

        // Photographic match-cut: the outgoing rear view turns edge-on as the
        // real Iveco front photograph appears in the final scene.
        // Animate the inner layer so the long-running journey timeline keeps
        // exclusive control of the vehicle's world position.
        const turn = gsap.fromTo(
          turningTruck,
          { rotationY: 0, autoAlpha: 1 },
          {
            rotationY: compact ? -76 : -82,
            autoAlpha: 0,
            ease: 'power1.inOut',
            scrollTrigger: {
              trigger: destination,
              start: 'top 86%',
              end: 'top 29%',
              scrub: compact ? 0.35 : 0.6,
              invalidateOnRefresh: true,
            },
          },
        );

        const frontReveal = gsap.fromTo(
          frontPhoto,
          { autoAlpha: 0, scale: compact ? 1.09 : 1.12 },
          {
            autoAlpha: 1,
            scale: 1,
            ease: 'power1.inOut',
            scrollTrigger: {
              trigger: destination,
              start: 'top 83%',
              end: 'top 26%',
              scrub: compact ? 0.35 : 0.6,
              invalidateOnRefresh: true,
            },
          },
        );

        // Let the vehicle finish its close-up in the destination scene, not
        // over legal links and footer content.
        const exit = gsap.fromTo(
          overlay,
          { opacity: 1 },
          {
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: footer,
              start: 'top bottom',
              end: 'top 63%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );

        return () => {
          frontReveal.kill();
          turn.kill();
          sequence.kill();
          exit.kill();
        };
      },
    );

    return () => matches.revert();
  }, []);

  return (
    <div className="cinematic-vehicle" aria-hidden="true">
      <div ref={vehicleRef} className="cinematic-vehicle-stage">
        <div className="cinematic-vehicle-turn">
          <div className="cinematic-vehicle-halo" />
          <div className="cinematic-vehicle-trail" />
          <Image
            src="/tow-truck-cutout.webp"
            alt=""
            width={996}
            height={509}
            sizes="(max-width: 767px) 82vw, 46vw"
            className="cinematic-vehicle-image"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}

