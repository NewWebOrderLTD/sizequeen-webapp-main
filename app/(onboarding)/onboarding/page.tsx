import { redirect } from 'next/navigation';
import { getSession } from '@/lib/utils/supabase/server';
import { createClient } from '@/lib/utils/supabase/server';
import OnboardingClient from './onboarding-client';

export const metadata = {
  title: 'Complete Your Profile | SizeQueen',
  description: 'Complete your measurements to get personalized recommendations',
};

// Check if user needs onboarding
async function checkOnboardingStatus(userId: string) {
  const supabase = await createClient();
  
  try {
    // Check if user has measurements
    const { data: measurements, error } = await supabase
      .from('user_measurements' as any)
      .select('*')
      .eq('user_id', userId)
      .single();

    // Check if user has all required profile data
    const { data: userDetails } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', userId)
      .single();

    // User needs onboarding if:
    // 1. No measurements exist
    const needsOnboarding = !measurements;
    
    return {
      needsOnboarding,
      existingMeasurements: measurements,
      userDetails,
    };
  } catch (error) {
    // If there's an error (likely no measurements), user needs onboarding
    return {
      needsOnboarding: true,
      existingMeasurements: null,
      userDetails: null,
    };
  }
}

export default async function OnboardingPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/signin');
  }

  const { needsOnboarding, existingMeasurements, userDetails } = await checkOnboardingStatus(session.user.id);
  
  // If user doesn't need onboarding, redirect to dashboard
  if (!needsOnboarding) {
    redirect('/dashboard');
  }

  return (
    <OnboardingClient 
      user={session.user} 
      existingMeasurements={existingMeasurements}
      userDetails={userDetails}
    />
  );
} 