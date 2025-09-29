import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types_db';

// Define a function to create a Supabase client for server-side operations
// The function takes an optional accessToken for Bearer token auth
export const createClient = async (accessToken?: string) => {
  const cookieStore = await cookies();

  // Check if required environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // eslint-disable-next-line no-console
    console.warn(
      'Supabase environment variables are missing. Using fallback configuration.',
    );
    // Return a mock client or throw an error based on your preference
    throw new Error(
      'Supabase configuration is missing. Please check your environment variables.',
    );
  }

  // If accessToken is provided, use it for authentication
  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        // The get method is used to retrieve a cookie by its name
        get: (name: string) => cookieStore.get(name)?.value,
        // The set method is used to set a cookie with a given name, value, and options
        set: async (name: string, value: string, options: CookieOptions) => {
          try {
            await cookieStore.set({ name, value, ...options });
          } catch (_error) {
            // If the set method is called from a Server Component, an error may occur
            // This can be ignored if there is middleware refreshing user sessions
          }
        },
        // The remove method is used to delete a cookie by its name
        remove: async (name: string, options: CookieOptions) => {
          try {
            await cookieStore.set({ name, value: '', ...options });
          } catch (_error) {
            // If the remove method is called from a Server Component, an error may occur
            // This can be ignored if there is middleware refreshing user sessions
          }
        },
      },
      ...(accessToken
        ? {
            global: {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          }
        : {}),
    },
  );
};

export async function getSession() {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error getting session:', error);
    return null;
  }
}
