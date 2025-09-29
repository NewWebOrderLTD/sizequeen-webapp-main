import { redirect } from 'next/navigation';
import { getSession } from '@/lib/utils/supabase/server';
import { createClient } from '@/lib/utils/supabase/server';
import DashboardClient from './dashboard-client';

export const metadata = {
  title: 'Dashboard | SizeQueen',
  description: 'Your account dashboard',
};

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/signin');
  }

  // Fetch data on the server side for SSR optimization
  const supabase = await createClient();
  
  // Parallel data fetching for better performance
  const [userDetailsResult, measurementsResult] = await Promise.allSettled([
    supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single(),
    supabase
      .from('user_measurements' as any)
      .select('*')
      .eq('user_id', session.user.id)
      .single(),
  ]);

  // Extract data from results
  const userDetails = userDetailsResult.status === 'fulfilled' 
    ? userDetailsResult.value.data 
    : null;
    
  const measurements = measurementsResult.status === 'fulfilled' && measurementsResult.value.data
    ? measurementsResult.value.data 
    : null;

  // Check if user needs onboarding (only check for measurements)
  const needsOnboarding = !measurements;
  
  // if (needsOnboarding) {
  //   redirect('/onboarding');
  // }

  return (
    <DashboardClient 
      session={session} 
      userDetails={userDetails}
      initialMeasurements={measurements}
    />
  );
}
