'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * Progressive motion layer for the marketing homepage.
 * Content stays visible without JS and when reduced motion is requested.
 * Smooth wheel scrolling is desktop-only; touch devices retain native scrolling.
 * No motion/scroll listeners are installed on /admin or legal pages.
 */
export function VisualMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-motion-root]');
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const desktopWheel = window.matchMedia('(min-width: 769px) and (pointer: fine)').matches;
    let lenis: Lenis | undefined;
    const tick = (time: number) => lenis?.raf(time * 1000);
    const syncScrollTrigger = () => ScrollTrigger.update();

    if (desktopWheel) {
      lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        anchors: true,
        autoRaf: false,
      });
      lenis.on('scroll', syncScrollTrigger);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-motion-intro]',
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'all',
        },
      );

      if (desktopWheel) {
        gsap.fromTo(
          '[data-motion-image]',
          { scale: 1.07 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '#sus',
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
            },
          },
        );
      }

      const elements = gsap.utils.toArray<HTMLElement>(
        '[data-motion-reveal], #servicii .section-title, #servicii .section-copy, ' +
        '#servicii .service-card, .service-hub-card, .route-flow article, ' +
        '#acoperire .section-title, #intrebari .section-title',
      );
      elements.forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: 'power2.out',
            clearProps: 'all',
            scrollTrigger: {
              trigger: element,
              start: 'top 92%',
              once: true,
            },
          },
        );
      });

      gsap.fromTo(
        '.visual-scroll-progress',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        },
      );
    }, root);

    // Reviews load asynchronously; refresh after initial hydration.
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      window.clearTimeout(refresh);
      context.revert();
      if (lenis) {
        lenis.off('scroll', syncScrollTrigger);
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
      }
    };
  }, []);

  return <div className="visual-scroll-progress" aria-hidden="true" />;
}

