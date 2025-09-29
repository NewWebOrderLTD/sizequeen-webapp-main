import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/utils/supabase/server';
import { stripe } from '@/lib/utils/stripe/config';
import { createOrRetrieveCustomer } from '@/lib/utils/supabase/admin';
import { getURL } from '@/lib/utils/helpers';

export async function POST(request: NextRequest) {
  try {
    const { priceId, planType = 'monthly' } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Get the user from Supabase auth
    const supabase = await createClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Retrieve or create the customer in Stripe
    let customer: string;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user.id,
        email: user.email || '',
      });
    } catch (err) {
      console.error('Error creating/retrieving customer:', err);
      return NextResponse.json(
        { error: 'Unable to access customer record' },
        { status: 500 }
      );
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: planType === 'monthly' ? 7 : 14, // 7 days for monthly, 14 for yearly
      },
      success_url: `${getURL()}/dashboard?success=true`,
      cancel_url: `${getURL()}/dashboard?canceled=true`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
