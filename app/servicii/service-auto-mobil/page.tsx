import type { Metadata } from 'next';
import { ServiceLanding } from '@/components/service-landing';

export const metadata: Metadata = {
  title: 'Service auto mobil Fetești | Tractări Auto Fetești',
  description:
    'Service auto mobil și verificare la fața locului în Fetești și zona apropiată. Confirmăm telefonic dacă problema poate fi rezolvată pe loc sau necesită tractare.',
};

export default function Page() {
  return <ServiceLanding serviceKey="mobile-service" />;
}
