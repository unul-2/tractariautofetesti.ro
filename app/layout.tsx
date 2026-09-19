import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { CookieConsent } from '@/components/cookie-consent';
import './globals.css';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tractariautofetesti.ro'),
  title: 'Tractări Auto Fetești | Asistență rutieră non-stop',
  description:
    'Tractare auto și asistență rutieră pentru Fetești, A2 și zona de acoperire confirmată telefonic.',
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    siteName: 'Tractări Auto Fetești',
    title: 'Tractări Auto Fetești | Asistență rutieră non-stop',
    description:
      'Ai nevoie de ajutor? Sună pentru confirmare rapidă a intervenției.',
    images: [
      {
        url: '/social-preview.png',
        width: 1733,
        height: 908,
        alt: 'Tractări Auto Fetești - platformă de tractare pe autostradă',
      },
    ],
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Tractări Auto Fetești',
  url: 'https://www.tractariautofetesti.ro',
  telephone: '+40723511865',
  email: 'tractariautofetesti24@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Strada Călărași nr. 1',
    addressLocality: 'Fetești',
    addressRegion: 'Ialomița',
    addressCountry: 'RO',
  },
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: 44.3732589,
      longitude: 27.8391185,
    },
    geoRadius: 50000,
  },
  openingHours: 'Mo-Su 00:00-23:59',
  description:
    'Tractare auto și asistență rutieră cu punct de plecare din Fetești, în mod uzual pe o rază de aproximativ 40–50 km; distanțele mai mari se confirmă telefonic.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className={`${geist.variable} antialiased`}>
        {children}
        <CookieConsent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </body>
    </html>
  );
}
