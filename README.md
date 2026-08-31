# tractariautofetesti.ro

Landing page mobile-first pentru Tractări Auto Fetești, construită pentru intervenții urgente: apel rapid, WhatsApp cu locație numai la alegerea utilizatorului, servicii, acoperire, recenzii, contact, întrebări și confidențialitate.

## Pornire locală

```bash
npm install
npm run dev
```

## Netlify

Repo-ul este pregătit pentru conectare directă în Netlify. Configurația inclusă setează `npm run build` și directorul public `dist`; în mediul Netlify, build-ul activează adaptorul Nitro care generează funcțiile necesare pentru rutele server-rendered.

După conectarea repo-ului, adaugă variabilele din `.env.example` numai după ce conversiile sunt configurate și testate în contul Google Ads.

## Google Ads și confidențialitate

1. Copiază `.env.example` în `.env.local`.
2. Completează ID-ul Google tag și etichetele conversiilor după ce contul clientului este disponibil.
3. Tag-ul Google Ads se încarcă numai după acordul expres pentru marketing. Apelurile și inițierile WhatsApp sunt evenimente separate.

## Înainte de publicare

- Confirmă denumirea legală, CUI/CIF, sediul și adresa de contact pentru date personale.
- Completează perioada de păstrare și destinatarii în politica de confidențialitate.
- Confirmă exact aria de acoperire, serviciile și datele din profilul Google Business.
- Verifică telefonul, WhatsApp-ul, harta, recenziile și conversiile în mediul Netlify.

Nu publica promisiuni de timp, prețuri sau statistici fără confirmarea operatorului.
