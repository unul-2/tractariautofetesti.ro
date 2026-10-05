export type Language = 'ro' | 'en';

export type ServiceKey =
  | 'mobile-service'
  | 'obd'
  | 'vehicle-transport'
  | 'equipment-transport';

export type ServiceContent = {
  eyebrow: string;
  title: string;
  shortTitle: string;
  summary: string;
  intro: string;
  situationsTitle: string;
  situations: string[];
  includesTitle: string;
  includes: string[];
  noteTitle: string;
  note: string;
  cta: string;
};

export type ServiceDefinition = {
  key: ServiceKey;
  href: string;
  analyticsKey: 'mobile-service' | 'obd' | 'vehicle-transport' | 'equipment-transport';
  ro: ServiceContent;
  en: ServiceContent;
};

export const serviceCatalog: Record<ServiceKey, ServiceDefinition> = {
  'mobile-service': {
    key: 'mobile-service',
    href: '/servicii/service-auto-mobil',
    analyticsKey: 'mobile-service',
    ro: {
      eyebrow: 'Intervenție la fața locului',
      title: 'Service auto mobil în Fetești și împrejurimi',
      shortTitle: 'Service auto mobil',
      summary: 'Pentru probleme care pot fi verificate sau rezolvate fără să tractăm imediat mașina.',
      intro:
        'Descrii problema și locația, iar noi confirmăm telefonic dacă intervenția poate fi făcută la fața locului sau dacă este mai sigură tractarea către un service.',
      situationsTitle: 'Când poate fi util',
      situations: [
        'Mașina nu mai pornește sau pornește greu',
        'Ai o problemă simplă care poate fi verificată la fața locului',
        'Ai nevoie de o evaluare înainte de a decide tractarea',
        'Vrei să eviți transportul inutil dacă problema poate fi rezolvată pe loc',
      ],
      includesTitle: 'Cum lucrăm',
      includes: [
        'Discuție scurtă la telefon despre simptome și locație',
        'Confirmarea disponibilității și a tipului de intervenție',
        'Verificare la fața locului în limita echipamentelor disponibile',
        'Recomandare clară: intervenție, service sau tractare',
      ],
      noteTitle: 'Important',
      note:
        'Nu prezentăm service-ul mobil ca înlocuitor pentru un atelier complet. Lucrările care necesită elevator, piese speciale sau condiții de atelier se trimit către un service potrivit.',
      cta: 'Verifică dacă putem interveni',
    },
    en: {
      eyebrow: 'On-site assistance',
      title: 'Mobile vehicle service in Fetești and nearby areas',
      shortTitle: 'Mobile vehicle service',
      summary: 'For problems that may be checked or solved without immediately recovering the vehicle.',
      intro:
        'Tell us the problem and location. We confirm by phone whether an on-site intervention is appropriate or whether recovery to a workshop is the safer option.',
      situationsTitle: 'When it can help',
      situations: [
        'The vehicle will not start or starts with difficulty',
        'A simple issue may be checked on site',
        'You need an assessment before deciding on recovery',
        'You want to avoid unnecessary transport if the issue can be solved on site',
      ],
      includesTitle: 'How we work',
      includes: [
        'Short phone assessment of symptoms and location',
        'Confirmation of availability and intervention type',
        'On-site check within the available equipment limits',
        'Clear recommendation: intervention, workshop or recovery',
      ],
      noteTitle: 'Important',
      note:
        'Mobile service is not presented as a replacement for a fully equipped workshop. Work requiring a lift, specialist parts or workshop conditions is referred to an appropriate garage.',
      cta: 'Check if we can assist',
    },
  },
  obd: {
    key: 'obd',
    href: '/servicii/diagnoza-obd',
    analyticsKey: 'obd',
    ro: {
      eyebrow: 'Diagnoză auto',
      title: 'Diagnoză OBD-II la fața locului',
      shortTitle: 'Diagnoză OBD-II',
      summary: 'Citire de erori și verificare preliminară pentru a înțelege mai repede ce se întâmplă cu mașina.',
      intro:
        'Conectăm echipamentul de diagnoză atunci când situația permite și folosim rezultatul ca punct de orientare pentru următorul pas: intervenție simplă, service sau tractare.',
      situationsTitle: 'Când poate fi utilă',
      situations: [
        'Ai martori aprinși în bord',
        'Motorul funcționează anormal sau intră în mod de protecție',
        'Mașina nu pornește și există suspiciunea unei erori electronice',
        'Vrei o verificare preliminară înainte de transportul la service',
      ],
      includesTitle: 'Ce poate include',
      includes: [
        'Conectare OBD-II când vehiculul și situația permit',
        'Citirea codurilor de eroare disponibile',
        'Interpretare preliminară, fără diagnostic mecanic inventat',
        'Recomandare pentru pasul următor',
      ],
      noteTitle: 'Ce nu promitem',
      note:
        'Un cod OBD nu este întotdeauna un diagnostic final. Pentru unele probleme sunt necesare măsurători, demontări sau teste într-un atelier.',
      cta: 'Solicită o verificare OBD',
    },
    en: {
      eyebrow: 'Vehicle diagnostics',
      title: 'On-site OBD-II diagnostics',
      shortTitle: 'OBD-II diagnostics',
      summary: 'Fault-code reading and preliminary checks to understand the vehicle problem faster.',
      intro:
        'When the situation allows, we connect diagnostic equipment and use the result to guide the next step: a simple intervention, workshop visit or vehicle recovery.',
      situationsTitle: 'When it can help',
      situations: [
        'Warning lights are on',
        'The engine behaves abnormally or enters limp mode',
        'The vehicle will not start and an electronic fault is suspected',
        'You want a preliminary check before transport to a workshop',
      ],
      includesTitle: 'What it may include',
      includes: [
        'OBD-II connection when vehicle and conditions allow',
        'Reading available fault codes',
        'Preliminary interpretation without inventing a mechanical diagnosis',
        'Recommendation for the next step',
      ],
      noteTitle: 'What we do not promise',
      note:
        'An OBD fault code is not always a final diagnosis. Some problems require measurements, dismantling or workshop testing.',
      cta: 'Request an OBD check',
    },
  },
  'vehicle-transport': {
    key: 'vehicle-transport',
    href: '/servicii/transport-auto',
    analyticsKey: 'vehicle-transport',
    ro: {
      eyebrow: 'Transport programat',
      title: 'Transport auto, nu doar tractare de urgență',
      shortTitle: 'Transport auto',
      summary: 'Mutăm autoturisme către service, domiciliu sau o destinație stabilită, inclusiv pentru transporturi programate.',
      intro:
        'Serviciul este potrivit și când mașina nu este într-o urgență: autoturisme cumpărate, avariate, neînmatriculate sau care nu trebuie conduse pe drum.',
      situationsTitle: 'Exemple de situații',
      situations: [
        'Mașină cumpărată care trebuie adusă acasă',
        'Autoturism avariat transportat către service',
        'Vehicul neînmatriculat sau care nu poate circula legal',
        'Transport planificat între două locații',
      ],
      includesTitle: 'Cum stabilim transportul',
      includes: [
        'Tipul și starea vehiculului',
        'Locul de preluare și destinația',
        'Accesul pentru platformă la ambele capete',
        'Costul și intervalul confirmate înainte de plecare',
      ],
      noteTitle: 'Transport sigur',
      note:
        'Confirmăm fiecare transport în funcție de dimensiunile, starea și posibilitatea de încărcare a vehiculului.',
      cta: 'Cere disponibilitate pentru transport',
    },
    en: {
      eyebrow: 'Scheduled transport',
      title: 'Vehicle transport, not only emergency recovery',
      shortTitle: 'Vehicle transport',
      summary: 'Transport to a workshop, home or another agreed destination, including scheduled jobs.',
      intro:
        'This service also covers non-emergency situations: purchased vehicles, damaged cars, unregistered vehicles or cars that should not be driven on public roads.',
      situationsTitle: 'Typical situations',
      situations: [
        'A purchased car needs to be brought home',
        'A damaged vehicle needs transport to a garage',
        'An unregistered vehicle cannot legally be driven',
        'Scheduled transport between two locations',
      ],
      includesTitle: 'How we confirm the job',
      includes: [
        'Vehicle type and condition',
        'Collection point and destination',
        'Recovery-truck access at both locations',
        'Cost and timing confirmed before departure',
      ],
      noteTitle: 'Safe transport',
      note:
        'Every job is confirmed according to the vehicle dimensions, condition and loading requirements.',
      cta: 'Check transport availability',
    },
  },
  'equipment-transport': {
    key: 'equipment-transport',
    href: '/servicii/transport-utilaje',
    analyticsKey: 'equipment-transport',
    ro: {
      eyebrow: 'Utilaje și vehicule speciale',
      title: 'Transport utilaje agricole și alte vehicule',
      shortTitle: 'Transport utilaje',
      summary: 'Putem facilita transportul pentru utilaje agricole, autoturisme și alte vehicule care necesită platformă sau transport specializat.',
      intro:
        'Pentru transporturile grele verificăm individual masa, dimensiunile, punctele de încărcare și transportatorul disponibil. Putem analiza inclusiv cazuri de până la aproximativ 7 tone, fără a confirma plecarea înainte de verificarea tehnică și legală.',
      situationsTitle: 'Ce putem analiza',
      situations: [
        'Utilaje agricole și echipamente pe roți',
        'Autoturisme și vehicule care necesită platformă mai mare',
        'Miniutilaje sau echipamente care pot fi încărcate în siguranță',
        'Transporturi programate între ferme, service-uri sau alte locații',
      ],
      includesTitle: 'Ce ne trebuie pentru ofertă',
      includes: [
        'Tipul utilajului sau vehiculului',
        'Masa aproximativă și dimensiunile',
        'Fotografii sau detalii despre punctele de încărcare, dacă sunt necesare',
        'Plecare, destinație și data dorită',
      ],
      noteTitle: 'Până la ~7 t: numai după confirmare',
      note:
        'Limita reală depinde de vehiculul de transport disponibil, masa totală autorizată, dimensiuni, ancorare și traseu. Pentru lucrările care depășesc platforma proprie putem facilita transportul prin colaboratori potriviți.',
      cta: 'Discută transportul utilajului',
    },
    en: {
      eyebrow: 'Machinery and special vehicles',
      title: 'Agricultural machinery and special-vehicle transport',
      shortTitle: 'Machinery transport',
      summary: 'We can facilitate transport for agricultural machinery, vehicles and equipment requiring a suitable recovery or specialist transport platform.',
      intro:
        'For heavier jobs we check weight, dimensions, loading points and the available carrier individually. We can assess jobs up to approximately 7 tonnes, but only confirm after technical and legal checks.',
      situationsTitle: 'Jobs we can assess',
      situations: [
        'Agricultural machinery and wheeled equipment',
        'Cars and vehicles requiring a larger platform',
        'Compact machinery that can be loaded safely',
        'Scheduled transport between farms, workshops or other locations',
      ],
      includesTitle: 'What we need to quote',
      includes: [
        'Machinery or vehicle type',
        'Approximate weight and dimensions',
        'Photos or loading-point details when required',
        'Collection, destination and preferred date',
      ],
      noteTitle: 'Up to ~7 t: confirmation required',
      note:
        'The real limit depends on the available transport vehicle, authorised total mass, dimensions, securing and route. Jobs outside our own platform capability may be facilitated through suitable transport partners.',
      cta: 'Discuss the machinery transport',
    },
  },
};

export const serviceOrder: ServiceKey[] = [
  'mobile-service',
  'obd',
  'vehicle-transport',
  'equipment-transport',
];

export function getService(key: ServiceKey, language: Language) {
  return serviceCatalog[key][language];
}
