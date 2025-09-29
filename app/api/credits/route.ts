import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/utils/supabase/server';

/**
 * GET handler to retrieve user credits
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const accessToken = authHeader?.replace('Bearer ', '');
  
  console.log('Credits API - GET request received');
  
  try {
    // Create Supabase client with user's access token
    const supabase = await createClient(accessToken);
    
    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Credits API - Authentication failed:', userError);
      return NextResponse.json(
        { error: 'Authentication failed', details: userError?.message || 'No user found' },
        { status: 401 }
      );
    }
    
    // Fetch user's credits from the users table
    const { data: userData, error: creditsError } = await supabase
      .from('users')
      .select('id, free_credits, pro_credits')
      .eq('id', user.id)
      .single();
    
    if (creditsError) {
      console.error('Credits API - Error fetching user credits:', creditsError);
      return NextResponse.json(
        { error: 'Failed to fetch credits', details: creditsError.message },
        { status: 500 }
      );
    }
    
    if (!userData) {
      console.error('Credits API - No user data found');
      return NextResponse.json(
        { error: 'User data not found' },
        { status: 404 }
      );
    }
    
    // Check subscription status
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('id, status, price_id')
      .eq('user_id', user.id)
      .order('created', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    console.log('Credits API - Subscription data:', subscriptionData);
    
    let isActivePremium = false;
    
    // Check if user has an active subscription
    if (subscriptionData && !subscriptionError) {
      isActivePremium = subscriptionData.status === 'active';
    }
    
    // Get current credit values
    const proCredits = userData.pro_credits || 0;
    const freeCredits = userData.free_credits || 0;
    
    // Check if user has any credits at all
    if (proCredits === 0 && freeCredits === 0) {
      console.log('Credits API - User has no credits');
      return NextResponse.json({
        error: 'No credits available',
        details: 'You have no credits left to use',
        credits: 0,
        credit_type: isActivePremium ? 'pro' : 'free',
        subscription_status: subscriptionData?.status || 'none',
        user_id: userData.id
      }, { status: 200 });
    }
    
    // Return the appropriate credits based on subscription status and credit availability
    if (isActivePremium && proCredits > 0) {
      console.log('Credits API - User has active premium subscription with pro_credits, returning pro_credits');
      return NextResponse.json({
        credits: proCredits,
        credit_type: 'pro',
        subscription_status: subscriptionData?.status,
        user_id: userData.id
      }, { status: 200 });
    } else if (isActivePremium && proCredits === 0 && freeCredits > 0) {
      console.log('Credits API - User has active premium subscription but no pro_credits, returning free_credits');
      return NextResponse.json({
        credits: freeCredits,
        credit_type: 'free',
        subscription_status: subscriptionData?.status,
        user_id: userData.id
      }, { status: 200 });

    } else {
      // User either doesn't have an active subscription or has no pro_credits left
      console.log('Credits API - Returning free_credits');
      return NextResponse.json({
        credits: freeCredits,
        credit_type: 'free',
        subscription_status: subscriptionData?.status || 'none',
        user_id: userData.id
      }, { status: 200 });
    }
    
  } catch (error) {
    console.error('Credits API - Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST handler to update user credits
 * Expected body: { operation: 'decrement' }
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const accessToken = authHeader?.replace('Bearer ', '');
  
  console.log('Credits API - POST request received');
  
  try {
    // Parse request body
    const body = await request.json();
    const { operation } = body;
    
    // Validate input
    if (operation !== 'decrement') {
      return NextResponse.json(
        { error: 'Invalid request', details: 'Only decrement operation is supported' },
        { status: 400 }
      );
    }
    
    // Create Supabase client with user's access token
    const supabase = await createClient(accessToken);
    
    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Credits API - Authentication failed:', userError);
      return NextResponse.json(
        { error: 'Authentication failed', details: userError?.message || 'No user found' },
        { status: 401 }
      );
    }
    
    // Check subscription status to determine which credits to modify
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('id, status, price_id')
      .eq('user_id', user.id)
      .order('created', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    const isActivePremium = subscriptionData && !subscriptionError && 
                           (subscriptionData.status === 'active');
    
    // Fetch current user data to determine current credits
    const { data: currentUserData, error: userDataError } = await supabase
      .from('users')
      .select('id, free_credits, pro_credits')
      .eq('id', user.id)
      .single();
    
    if (userDataError || !currentUserData) {
      console.error('Credits API - Error fetching current user data:', userDataError);
      return NextResponse.json(
        { error: 'Failed to fetch current user data', details: userDataError?.message || 'User data not found' },
        { status: 500 }
      );
    }
    
    // Prepare update data
    const updateData: { free_credits?: number; pro_credits?: number } = {};
    
    // Get current credit values
    const currentProCredits = currentUserData.pro_credits || 0;
    const currentFreeCredits = currentUserData.free_credits || 0;
    
    console.log(`Credits API - Current credits: pro=${currentProCredits}, free=${currentFreeCredits}`);
    
    // Logic to decrement from pro_credits first, then free_credits if pro_credits is 0
    if (isActivePremium && currentProCredits > 0) {
      // Decrement from pro_credits
      updateData.pro_credits = currentProCredits - 1;
      console.log(`Credits API - Decrementing pro_credits to ${updateData.pro_credits}`);
    } else if (currentFreeCredits > 0) {
      // Pro credits are 0, decrement from free_credits
      updateData.free_credits = currentFreeCredits - 1;
      console.log(`Credits API - Pro credits are 0, decrementing free_credits to ${updateData.free_credits}`);
    } else {
      // Both credit types are 0, return error
      console.log(`Credits API - No credits available to decrement`);
      return NextResponse.json(
        { 
          error: 'Insufficient credits', 
          details: 'You have no credits left to use', 
          credits: 0,
          credit_type: isActivePremium ? 'pro' : 'free',
          subscription_status: subscriptionData?.status || 'none',
          user_id: currentUserData.id
        },
        { status: 400 }
      );
    }
    
    // Update user's credits
    const { data: updatedData, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select('id, free_credits, pro_credits')
      .single();
    
    if (updateError) {
      console.error('Credits API - Error updating user credits:', updateError);
      return NextResponse.json(
        { error: 'Failed to update credits', details: updateError.message },
        { status: 500 }
      );
    }
    
    // Determine the credit type to return in the response
    let creditType = 'free';
    let currentCredits = 0;
    
    // If pro credits were decremented but are now 0, use free credits in the response
    if ('pro_credits' in updateData) {
      if (updatedData.pro_credits > 0) {
        // If pro credits are still available, return them
        creditType = 'pro';
        currentCredits = updatedData.pro_credits;
      } else if (updatedData.free_credits > 0) {
        // Pro credits are now 0, return free credits if available
        creditType = 'free';
        currentCredits = updatedData.free_credits;
        console.log(`Credits API - Pro credits are now 0, returning free_credits: ${currentCredits}`);
      } else {
        // No credits left
        creditType = 'free';
        currentCredits = 0;
      }
    } else {
      // Free credits were decremented
      creditType = 'free';
      currentCredits = updatedData.free_credits;
    }
    
    console.log(`Credits API - Returning credit type: ${creditType}, amount: ${currentCredits}`);
    
    // Return the updated credits data based on which type was decremented
    return NextResponse.json({
      credits: currentCredits,
      credit_type: creditType,
      subscription_status: subscriptionData?.status || 'none',
      user_id: updatedData.id,
      updated: true
    }, { status: 200 });
    
  } catch (error) {
    console.error('Credits API - Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
