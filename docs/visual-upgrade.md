# Visual upgrade (GSAP + Lenis + 21st.dev inspiration)

## Scope

Homepage marketing UI only. Existing routes, phone / WhatsApp conversion components,
RO/EN language toggle, cookie consent, Google Reviews, /admin, Netlify functions,
Google Ads conversion tracking and legal pages are unchanged.

## Motion stack

- **GSAP + ScrollTrigger**: lightweight hero entrances, one-shot section reveals,
  subtle desktop hero image parallax and a scroll progress indicator.
- **Lenis**: desktop wheel scrolling only (fine pointer + min 769px). Synced with
  GSAP ticker; preserves native touch scroll and anchor navigation.
- **21st.dev visual design patterns**: soft spotlight surfaces, hover accent rails,
  high-contrast type, responsive premium cards. No external registry component
  was copied or bundled.

## Accessibility / performance

- Motion is completely disabled for prefers-reduced-motion: reduce.
- The page stays visible and usable if JavaScript is disabled or animation fails.
- Animations use opacity and transforms; desktop parallax only, no continuous
  mobile smooth-scroll loop. No third-party CDN dependency or external tracking.
- CSS focus-visible ring retained; CTA hrefs and analytics remain unchanged.

## Checks

Run npm ci && npm run lint && npm run build.
Manual smoke-test: /#servicii, /#recenzii, /admin, /confidentialitate,
service subpages, both languages, mobile click-to-call and WhatsApp,
reduced motion, small viewport and slow mobile connection.

## Cinematic tow truck (2026-10-11)

- `components/tow-truck-cinematic.tsx` renders a decorative truck layer on the
  homepage, driven by the existing GSAP/ScrollTrigger stack.
- Transparent truck image `public/tow-truck-cutout.webp` is extracted from the
  existing hero photograph, optimized to ~42 KB (no external image dependency).
- Truck moves from the motorway scene to a new destination scene, growing with
  scroll; it fades away as the footer enters to preserve legal navigation.
- Mobile has reduced opacity/scale and retains native touch scrolling;
  reduced-motion preferences disable the moving image.
- `/admin`, conversion links, cookie consent and tracking remain unchanged.


## Real front photograph + cinematic turn (2026-10-11)

The real front/three-quarter photograph of the Iveco flatbed on the existing
business website (https://tractariautofetesti.ro/hero-truck.webp) is stored
locally as public/tow-truck-front.webp. The file is the original asset,
not generated and not loaded from a third-party origin at runtime.

In the final arrival scene the earlier rear cutout rotates out in perspective
and the authentic front view fades in with a subtle zoom. Mobile uses a
bottom-weighted composition, with the headline fully readable above it.
Reduced-motion users see the front photograph without the transition.
No changes to /admin, phone links, Google Ads or analytics.


## Clean cinematic arrival — 2026-10-12

Previous full-page floating truck and faux perspective turning were removed due to
poor visual quality. A single opaque photograph of the original Iveco truck is
now presented in a dedicated premium scene with an on-scroll reveal and modest
camera zoom; no transparency or ghost effect. No fixed decorative overlays,
all phone/WhatsApp CTA hit targets remain unobstructed, /admin and Google Ads
tracking remain untouched. All motion respects reduced-motion preferences.
The real Iveco photograph is retained locally as public/tow-truck-front.webp.
