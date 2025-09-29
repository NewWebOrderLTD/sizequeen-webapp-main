'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStripe } from '@/lib/utils/stripe/client';
import { getErrorRedirect } from '@/lib/utils/helpers';
import { YellowButton } from '@/components/ui/buttons';
import { PremiumTickIcon, PremiumLineIcon } from '@/components/ui/icons';

const plans = [
  {
    name: 'Basic',
    price: '$2.99',
    period: 'per month',
    description: 'Perfect for occasional size checks',
    features: [
      '10 Fit Scans / Month',
      'Basic Size Accuracy',
      'Email Support',
      'Standard Features'
    ],
    priceId: 'price_basic_month', // Replace with actual Stripe price ID
    popular: false,
    trialDays: 3
  },
  {
    name: 'Premium',
    price: '$4.99',
    period: 'per month',
    description: 'Best for regular shoppers and fashion enthusiasts',
    features: [
      '100 Fit Scans / Month',
      'Advanced Fit Accuracy',
      'Early New Features Access',
      'Priority Support',
      'Unlimited Size Charts',
      'Mobile App Access'
    ],
    priceId: 'price_premium_month', // Replace with actual Stripe price ID
    popular: true,
    trialDays: 7
  },
  {
    name: 'Premium Annual',
    price: '$49.90',
    period: 'per year',
    description: 'Save 17% with annual billing',
    features: [
      '100 Fit Scans / Month',
      'Advanced Fit Accuracy',
      'Early New Features Access',
      'Priority Support',
      'Unlimited Size Charts',
      'Mobile App Access',
      '17% Savings'
    ],
    priceId: 'price_premium_year', // Replace with actual Stripe price ID
    popular: false,
    trialDays: 14
  }
];

export default function PricingPlans() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, planName: string) => {
    setLoading(priceId);
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          planType: planName.toLowerCase().includes('annual') ? 'yearly' : 'monthly'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const stripe = await getStripe();
      await stripe?.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.error('Subscription error:', error);
      router.push(
        getErrorRedirect(
          '/pricing',
          'Subscription failed.',
          'Please try again later or contact support.',
        ),
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-fg-text-contrast mb-4">
          Choose Your <span className="text-primary-solid">Perfect Plan</span>
        </h1>
        <p className="text-xl text-fg-text-muted max-w-2xl mx-auto">
          Get accurate size recommendations and never buy the wrong size again
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white rounded-2xl border-2 p-8 ${
              plan.popular
                ? 'border-primary-solid shadow-xl scale-105'
                : 'border-gray-200 shadow-lg'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-solid text-primary-on-primary px-4 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-fg-text-contrast mb-2">
                {plan.name}
              </h3>
              <p className="text-fg-text-muted mb-4">{plan.description}</p>
              
              <div className="mb-4">
                <span className="text-5xl font-bold text-fg-text-contrast">
                  {plan.price}
                </span>
                <span className="text-fg-text-muted ml-2">{plan.period}</span>
              </div>
              
              {plan.trialDays > 0 && (
                <p className="text-sm text-primary-solid font-semibold">
                  {plan.trialDays}-day free trial
                </p>
              )}
            </div>

            {/* Features */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-semibold text-fg-text-contrast">
                  What's included
                </span>
                <PremiumLineIcon width={80} height={2} />
              </div>
              
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <PremiumTickIcon size={16} />
                    <span className="text-fg-text-contrast">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscribe Button */}
            <YellowButton
              onClick={() => handleSubscribe(plan.priceId, plan.name)}
              disabled={loading === plan.priceId}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                plan.popular
                  ? 'bg-primary-solid text-primary-on-primary hover:bg-primary-solid-hover'
                  : 'bg-primary-solid text-primary-on-primary hover:bg-primary-solid-hover'
              }`}
            >
              {loading === plan.priceId ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                `Start ${plan.trialDays}-Day Free Trial`
              )}
            </YellowButton>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-fg-text-contrast mb-12">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-fg-text-contrast mb-2">
              How does the free trial work?
            </h3>
            <p className="text-fg-text-muted">
              You can try any plan for free during the trial period. No credit card required to start. 
              You'll only be charged after the trial ends if you don't cancel.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-fg-text-contrast mb-2">
              Can I change my plan later?
            </h3>
            <p className="text-fg-text-muted">
              Yes! You can upgrade or downgrade your plan at any time from your dashboard. 
              Changes will be prorated automatically.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-fg-text-contrast mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-fg-text-muted">
              We accept all major credit cards (Visa, MasterCard, American Express) through our secure Stripe payment processor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
