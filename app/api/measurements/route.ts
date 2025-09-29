import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const accessToken = authHeader?.replace("Bearer ", "");

  console.log("Received Authorization:", authHeader);
  console.log("Received x-refresh-token:", request.headers.get("x-refresh-token"));
  console.log("Request origin:", request.headers.get('origin'));

  try {
    const supabase = await createClient(accessToken);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: userError?.message || 'User not authenticated' },
        { status: 401 }
      );
    }

    const { data: measurements, error: measurementsError } = await supabase
      .from('user_measurements')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (measurementsError || !measurements) {
      return NextResponse.json(
        { error: measurementsError?.message || 'No measurements found for user' },
        { status: measurementsError ? 500 : 404 }
      );
    }

    return NextResponse.json(
      { measurements },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const accessToken = authHeader?.replace("Bearer ", "");

  console.log("Received Authorization:", authHeader);

  try {
    // Get the request body
    const measurementsData = await request.json();
    
    console.log('Received measurements data:', measurementsData);
    
    // Validate auth token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Auth token missing!' },
        { status: 401 }
      );
    }

    const supabase = await createClient(accessToken);

    // Verify the user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Auth error:', userError);
      return NextResponse.json(
        { error: userError?.message || 'User not authenticated' },
        { status: 401 }
      );
    }

    // Extract personal info and measurements from the data
    // Handle both structured format { personalInfo, measurements } and flat format
    let personalInfo, measurements;
    
    if (measurementsData.personalInfo && measurementsData.measurements) {
      // Structured format
      personalInfo = measurementsData.personalInfo;
      measurements = measurementsData.measurements;
    } else {
      // Flat format - extract personal info and measurements
      const { full_name, gender, age, ...measurementFields } = measurementsData;
      personalInfo = { name: full_name, gender, age };
      measurements = measurementFields;
    }
    
    // Update user profile with personal info if provided
    let profileUpdated = false;
    if (personalInfo && (personalInfo.name || personalInfo.gender || personalInfo.age)) {
      const { name, gender, age } = personalInfo;
      
      console.log('Updating profile with:', { full_name: name, gender, age });
      
      try {
        const { error: profileError, data: profileData } = await supabase
          .from('users')
          .update({
            full_name: name,
            gender,
            age
          })
          .eq('id', user.id)
          .select();
        
        if (profileError) {
          console.error('Error updating profile:', profileError);
          console.error('Profile error details:', JSON.stringify(profileError, null, 2));
          // Don't return error, just log it and continue with measurements
          console.log('Continuing with measurements despite profile error...');
        } else {
          console.log('Profile updated successfully:', profileData);
          profileUpdated = true;
        }
      } catch (profileException) {
        console.error('Profile update exception:', profileException);
        console.log('Continuing with measurements despite profile exception...');
      }
    } else {
      console.log('No personal info to update or missing fields');
    }
    
    // Handle measurements if provided
    if (measurements && Object.keys(measurements).length > 0) {
      console.log('Processing measurements:', measurements);
      // Check if measurements exist for this user
      const { data: existingMeasurements } = await supabase
        .from('user_measurements')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      let measurementsError;
      
      // Insert or update measurements
      if (existingMeasurements) {
        const { error } = await supabase
          .from('user_measurements')
          .update({
            ...measurements,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
        measurementsError = error;
      } else {
        const { error } = await supabase
          .from('user_measurements')
          .insert([{ 
            user_id: user.id,
            ...measurements,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
        measurementsError = error;
      }
      
      if (measurementsError) {
        console.error('Error saving measurements:', measurementsError);
        return NextResponse.json(
          { error: 'Failed to save measurements' },
          { status: 500 }
        );
      }
      
      console.log('Measurements saved successfully');
    } else {
      console.log('No measurements to save or empty measurements object');
    }
    
    // Return success response
    return NextResponse.json(
      { 
        success: true,
        message: 'Data saved successfully',
        profileUpdated: !!personalInfo,
        measurementsUpdated: !!measurements
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}