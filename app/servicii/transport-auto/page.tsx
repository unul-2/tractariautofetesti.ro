import type { Metadata } from 'next';
import { ServiceLanding } from '@/components/service-landing';

export const metadata: Metadata = {
  title: 'Transport auto Fetești | Tractări Auto Fetești',
  description:
    'Transport programat pentru autoturisme avariate, cumpărate, neînmatriculate sau care nu trebuie conduse pe drum.',
};

export default function Page() {
  return <ServiceLanding serviceKey="vehicle-transport" />;
}
