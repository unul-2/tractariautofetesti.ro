# Tractări Auto Fetești — dual-source admin metrics

## Audit 13 octombrie 2026
- Dashboard-ul are deja comparație responsivă Site vs Google Ads (7/14/30 zile).
- Site tracking măsoară page_view, call_click, whatsapp_click și
  whatsapp_location_click după acceptarea cookie-urilor. Netlify Blobs păstrează
  evenimente agregate pentru dashboardul Netlify Identity (rol admin).
- Google Ads este disponibil în ChatGPT prin HYPD, cont 3377885049, dar
  conectorul ChatGPT NU transferă automat acreditările către Netlify.
- În Netlify site-level este setat NEXT_PUBLIC_ADMIN_DEMO_ENABLED=true;
  autentificarea demonstrativă afișează valori fictive.
- Lipsește configurația server-side pentru Google Ads și eticheta gtag
  NEXT_PUBLIC_GOOGLE_TAG_ID; nu confunda Ads cu evenimentele site-ului.

## Conectare Google Ads direct la Netlify, numai citire
Setare în Netlify Environment Variables, production / functions, secret:
GOOGLE_ADS_CUSTOMER_ID, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_CLIENT_ID,
GOOGLE_ADS_CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN.
GOOGLE_ADS_LOGIN_CUSTOMER_ID este opțional (pentru MCC).
Nu copia niciun secret în GitHub, NEXT_PUBLIC sau chat.
API-ul Google Ads este deja în netlify/lib/google-ads.ts; endpointul read-only
este /api/admin/google-ads și necesită Netlify Identity cu rol admin.
Scrierea reclamelor rămâne dezactivată, independent de citire.
Dezactivează DEMO după verificarea unui utilizator Identity administrativ real.

## Semnificația datelor
Google Ads clicks != site sessions != call clicks != phone calls.
Vizitele proprii și apăsările sunt măsurate doar cu consimțământ.
gclid/gbraid/wbraid sunt folosite ca semnale pentru sursa CPC, fără
a păstra sau transmite identificatorii clickului. Sursa UTM se păstrează
doar pe durata sesiunii în browser pentru atribuire prin pagini.
Nu presupune legarea proprietății GA4 din HYPD de acest site până la verificare.
