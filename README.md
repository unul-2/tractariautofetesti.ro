# tractariautofetesti.ro

Landing page mobile-first pentru Tractări Auto Fetești, construită pentru intervenții urgente: apel rapid, WhatsApp cu locație numai la alegerea utilizatorului, servicii, acoperire, recenzii, contact, întrebări și confidențialitate.

## Pornire locală

```bash
npm install
npm run dev
```

## Netlify

Repo-ul este pregătit pentru conectare directă în Netlify. Configurația publică directorul static `dist/client`; funcțiile server-side sunt în `netlify/functions` și sunt publicate separat de Netlify.

După conectarea repo-ului, adaugă variabilele din `.env.example` numai după ce conversiile sunt configurate și testate în contul Google Ads.

## Google Ads și confidențialitate

1. Copiază `.env.example` în `.env.local`.
2. Completează ID-ul Google tag și etichetele conversiilor după ce contul clientului este disponibil.
3. Tag-ul Google Ads se încarcă numai după acordul expres pentru marketing. Apelurile și inițierile WhatsApp sunt evenimente separate.

## Recenzii Google actualizate automat

Site-ul nu extrage pagina Google prin scraping. Funcția `google-reviews` folosește API-ul oficial Google Places (New), cere datele live când secțiunea devine vizibilă și nu stochează local ratinguri, texte, autori sau fotografii. Dacă nu setezi `GOOGLE_PLACE_ID`, funcția caută o singură dată profilul exact din Fetești și persistă numai Place ID-ul, lucru permis de Google.

În Google Cloud:

1. creează sau alege proiectul deținut de firmă și activează billing;
2. activează **Places API (New)**;
3. creează o cheie cu restricție la acest API și salveaz-o în Netlify ca `GOOGLE_MAPS_API_KEY` — nu o pune în cod și nu folosi prefixul `NEXT_PUBLIC_`;
4. opțional, pune Place ID-ul verificat în `GOOGLE_PLACE_ID` ca să eviți căutarea inițială.

Componentele afișează mereu autorul, linkul către opinia originală, data relativă, sursa Google Maps și explicația că sunt primele opinii în ordinea de relevanță oferită de Google. Aceste elemente nu trebuie eliminate.

## Dashboard privat și măsurare

Pagina `/admin` nu conține date sensibile în HTML. Datele sunt oferite exclusiv prin `/api/admin/metrics`, iar funcția acceptă doar un utilizator Netlify Identity cu rolul `admin`.

În Netlify, după primul deploy:

1. deschide **Project configuration → Identity** și activează Identity;
2. setează înregistrarea la **Invite only**;
3. invită e-mailul administratorului și setează rolul `admin`;
4. în **Environment variables**, adaugă `ANALYTICS_RETENTION_DAYS=90` și, când este pregătit, `GOOGLE_MAPS_API_KEY`;
5. verifică `/admin` într-o fereastră privată: fără autentificare nu trebuie să poată încărca metrici.

Măsurarea pornește numai după „Accept marketing”. Păstrează evenimente agregate (pagină, tip dispozitiv, sursă UTM, apăsări pe Call/WhatsApp), fără IP, număr de telefon, conversație sau coordonate GPS. O funcție programată șterge datele mai vechi decât perioada configurată. „Apăsare pe Sună” este un semnal de intenție, nu dovada unui apel finalizat; conversiile reale de apel rămân în Google Ads.

Pentru prezentarea temporară pe site-ul Netlify de test, poți activa `NEXT_PUBLIC_ADMIN_DEMO_ENABLED=true`. Atunci `/admin` acceptă contul demo `1@1.com` cu parola `1234` și afișează clar numai date fictive; nu există un cont real, nu poate citi endpointul de metrici și nu oferă acces la Netlify. Elimină variabila înainte de lansarea publică. În Netlify, autentificarea reală rămâne prin Identity și rolul `admin`.

## Înainte de publicare

- Confirmă denumirea legală, CUI/CIF, sediul și adresa de contact pentru date personale.
- Completează perioada de păstrare și destinatarii în politica de confidențialitate.
- Confirmă exact aria de acoperire, serviciile și datele din profilul Google Business.
- Verifică telefonul, WhatsApp-ul, harta, recenziile și conversiile în mediul Netlify.

Nu publica promisiuni de timp, prețuri sau statistici fără confirmarea operatorului.
