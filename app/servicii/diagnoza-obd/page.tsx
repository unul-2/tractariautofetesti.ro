import type { Metadata } from 'next';
import { ServiceLanding } from '@/components/service-landing';

export const metadata: Metadata = {
  title: 'Diagnoză OBD-II Fetești | Tractări Auto Fetești',
  description:
    'Diagnoză OBD-II la fața locului, citire coduri de eroare și evaluare preliminară pentru a decide corect următorul pas.',
};

export default function Page() {
  return <ServiceLanding serviceKey="obd" />;
}
