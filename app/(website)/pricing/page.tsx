import { Metadata } from 'next';
import { getURL } from '@/lib/utils';
import PricingPlans from './pricing-client';

export const metadata: Metadata = {
  title: 'Pricing | SizeQueen',
  description: 'Choose the perfect plan for your size recommendation needs',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: getURL(),
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg-base">
      <PricingPlans />
    </div>
  );
}
