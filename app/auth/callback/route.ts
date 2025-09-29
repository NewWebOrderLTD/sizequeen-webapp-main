import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getErrorRedirect, getStatusRedirect } from '@/lib/utils/helpers';

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // Handle OAuth errors (e.g., user denied access, invalid client, etc.)
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      getErrorRedirect(
        `${requestUrl.origin}/signin`,
        error,
        errorDescription || "Authentication failed. Please try again.",
      ),
    );
  }

  if (code) {
    const supabase = await createClient();

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Session exchange error:', exchangeError);
      return NextResponse.redirect(
        getErrorRedirect(
          `${requestUrl.origin}/signin`,
          exchangeError.name,
          exchangeError.message || "Sorry, we weren't able to log you in. Please try again.",
        ),
      );
    }
  } else {
    // No code provided - redirect to signin with error
    return NextResponse.redirect(
      getErrorRedirect(
        `${requestUrl.origin}/signin`,
        'no_code',
        "No authorization code received. Please try signing in again.",
      ),
    );
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(
    getStatusRedirect(
      `${requestUrl.origin}/account`,
      'Success!',
      'You are now signed in.',
    ),
  );
}
