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
