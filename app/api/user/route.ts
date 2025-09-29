import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    console.log("Received Authorization:", request.headers.get("authorization"));
    console.log("Received x-refresh-token:", request.headers.get("x-refresh-token"));
    
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      return NextResponse.json(
        { error: 'Authentication failed', details: userError.message },
        { 
          status: 401,
        }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { 
          status: 401,
        }
      );
    }

    // Get user details from the users table
    const { data: userDetails, error: detailsError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (detailsError) {
      console.error('Error fetching user details:', detailsError);
      // Return basic user info even if extended details aren't available
      return NextResponse.json(
        {
          user: {
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata,
            created_at: user.created_at,
          },
        },
        { 
          status: 200,
        }
      );
    }

    return NextResponse.json(
      {
        user: {
          ...userDetails,
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
          created_at: user.created_at,
        },
      },
      { 
        status: 200,
      }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
      }
    );
  }
} 