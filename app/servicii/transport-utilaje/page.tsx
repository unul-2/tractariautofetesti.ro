import type { Metadata } from 'next';
import { ServiceLanding } from '@/components/service-landing';

export const metadata: Metadata = {
  title: 'Transport utilaje agricole Fetești | Tractări Auto Fetești',
  description:
    'Transport și facilitare transport pentru utilaje agricole, miniutilaje și alte vehicule. Cazurile grele sunt confirmate individual după masă, dimensiuni și traseu.',
};

export default function Page() {
  return <ServiceLanding serviceKey="equipment-transport" />;
}
