'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** A single intentional scene, not a truck moving over the entire website. */
export function ArrivalMotion() {
  useEffect(() => {
    const section = document.getElementById('sosire');
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(
        '.cinematic-arrival-copy',
        { y: 36, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: .85,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: { trigger: section, start: 'top 85%', once: true },
        },
      );

      gsap.fromTo(
        '.cinematic-arrival-frame',
        { y: 65, rotation: 1.5, scale: .94 },
        {
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 1.15,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: { trigger: section, start: 'top 85%', once: true },
        },
      );

      // An opaque photograph with a slow, scroll-controlled camera push.
      // No alpha fade on the truck, no 3D spin, no overlapping content.
      gsap.fromTo(
        '.cinematic-arrival-picture',
        { scale: 1.08 },
        {
          scale: 1.0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        },
      );

      gsap.fromTo(
        '.cinematic-arrival-light',
        { xPercent: -70, autoAlpha: 0 },
        {
          xPercent: 70,
          autoAlpha: .7,
          duration: .95,
          ease: 'power1.inOut',
          scrollTrigger: { trigger: section, start: 'top 67%', once: true },
        },
      );
    }, section);

    return () => context.revert();
  }, []);

  return null;
}
