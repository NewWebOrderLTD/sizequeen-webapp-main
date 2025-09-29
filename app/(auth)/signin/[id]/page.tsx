import React from 'react';
import { Button, Card } from '@/components/ui';
import { TextLogo } from '@/components/ui/text-logo';
import { createClient } from '@/lib/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  getAuthTypes,
  getViewTypes,
  getDefaultSignInView,
  getRedirectMethod,
} from '@/lib/utils/auth-helpers/settings';
import { PasswordSignIn } from '@/components/ui/auth-forms/password-signin';
import EmailSignIn from '@/components/ui/auth-forms/email-signin';
import ForgotPassword from '@/components/ui/auth-forms/forgot-password';
import ResetPassword from '@/components/ui/auth-forms/reset-password';
import UpdatePassword from '@/components/ui/auth-forms/update-password';
import SignUp from '@/components/ui/auth-forms/signup';
import Separator from '@/components/ui/auth-forms/separator';
import OauthSignIn from '@/components/ui/auth-forms/o-auth-signin';
import OnboardingBackground from '@/components/onboarding/onboarding-background';
import Link from 'next/link';

export default async function SignIn({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ disable_button: boolean }>;
}) {
  const { allowOauth, allowEmail, allowPassword } = getAuthTypes();
  const viewTypes = getViewTypes();
  const redirectMethod = getRedirectMethod();

  // Declare 'viewProp' and initialize with the default value
  let viewProp: string;

  // Assign url id to 'viewProp' if it's a valid string and ViewTypes includes it
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  if (typeof id === 'string' && viewTypes.includes(id)) {
    viewProp = id;
  } else {
    const preferredSignInView =
      (await cookies()).get('preferredSignInView')?.value || null;
    viewProp = getDefaultSignInView(preferredSignInView);
    return redirect(`/signin/${viewProp}`);
  }

  // Check if the user is already logged in and redirect to the account page if so
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && viewProp !== 'update_password') {
    return redirect('/');
  } else if (!user && viewProp === 'update_password') {
    return redirect('/signin');
  }

  return (
    <div className="min-h-screen relative">
      <OnboardingBackground />
      
      {/* Logo - Responsive positioning */}
      <div 
        className="absolute z-20"
        style={{
          width: '216.0005645751953px',
          height: '40.00019454956055px',
          top: '40px',
          left: '0px',
        }}
      >
        <TextLogo className="w-full h-full" />
      </div>

      {/* Top navigation */}
      <nav className="fixed top-0 right-0 p-4 sm:p-6 z-30">
        {viewProp === 'signup' ? (
          <Link href="/signin">
            <Button color="gray" variant="ghost" size="small">
              Login
            </Button>
          </Link>
        ) : viewProp !== 'update_password' &&
          viewProp !== 'forgot_password' &&
          viewProp !== 'reset_password' ? (
          <Link href="/signin/signup">
            <Button color="gray" variant="ghost" size="small">
              Register
            </Button>
          </Link>
        ) : null}
      </nav>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-4">
        <div 
          className={`rounded-2xl sm:rounded-3xl lg:rounded-[32px] flex flex-col items-center w-full max-w-sm sm:max-w-md md:max-w-md lg:w-[440px] h-auto ${viewProp === 'forgot_password' ? 'min-h-[240px] sm:min-h-[260px]' : 'min-h-[470px] sm:min-h-[500px] md:min-h-[520px] lg:min-h-[500px]'} border-t-2 border-l-2 border-r-4 border-b-4 lg:border-r-6 lg:border-b-6 border-solid pt-4 sm:pt-5 md:pt-6 px-4 sm:px-5 md:px-6 pb-3 sm:pb-4 md:pb-5 gap-3 sm:gap-4`}
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: 'var(--fg-text-contrast)',
          }}
        >
          {/* Title */}
          {viewProp !== 'forgot_password' &&
          viewProp !== 'update_password' &&
          viewProp !== 'reset_password' &&
          (viewProp === 'password_signin' || viewProp === 'signup') ? (
            <div className="w-full max-w-[400px] text-center mb-2">
              <h1 className="font-clash-display font-semibold text-fg-text-contrast text-lg sm:text-xl lg:text-xl">
                {viewProp === 'password_signin' ? 'Log in' : 'Sign up'}
              </h1>
            </div>
          ) : null}

          {/* Auth Content */}
          <div className="w-full max-w-[400px] flex-1 flex flex-col">
            <Card
              title={
                viewProp === 'password_signin'
                  ? ''
                  : viewProp === 'signup'
                    ? ''
                    : viewProp === 'forgot_password'
                      ? 'Forgot your password?'
                      : viewProp === 'reset_password'
                        ? 'Password Reset'
                        : viewProp === 'update_password'
                          ? 'Update Password'
                          : 'Sign In'
              }
              description={
                viewProp === 'password_signin'
                  ? ''
                  : viewProp === 'signup'
                    ? "Get started by creating an account. It's free."
                    : viewProp === 'reset_password'
                      ? "We're verifying your password reset request."
                      : viewProp === 'forgot_password'
                        ? "Don't worry, we'll send you a message to help you reset your password."
                        : viewProp === 'update_password'
                          ? 'Please set a new password for your account'
                          : 'Login to continue to the app.'
              }
              titleClassName={viewProp === 'forgot_password' ? 'text-left' : 'text-center'}
              descriptionClassName={viewProp === 'forgot_password' ? 'text-left' : 'text-center'}
            >
              <div className="w-full">
                {viewProp !== 'update_password' &&
                  viewProp !== 'forgot_password' &&
                  viewProp !== 'reset_password' &&
                  allowOauth && (
                  <div className="w-full">
                    <OauthSignIn />
                    <Separator text="OR" />
                  </div>
                )}
                {viewProp === 'password_signin' && (
                  <PasswordSignIn
                    allowEmail={allowEmail}
                    redirectMethod={redirectMethod}
                  />
                )}
                {viewProp === 'email_signin' && (
                  <EmailSignIn
                    allowPassword={allowPassword}
                    redirectMethod={redirectMethod}
                    disableButton={resolvedSearchParams.disable_button}
                  />
                )}
                {viewProp === 'forgot_password' && (
                  <ForgotPassword
                    allowEmail={allowEmail}
                    redirectMethod={redirectMethod}
                    disableButton={resolvedSearchParams.disable_button}
                  />
                )}
                {viewProp === 'reset_password' && (
                  <ResetPassword redirectMethod={redirectMethod} />
                )}
                {viewProp === 'update_password' && (
                  <UpdatePassword redirectMethod={redirectMethod} />
                )}
                {viewProp === 'signup' && (
                  <SignUp
                    allowEmail={allowEmail}
                    redirectMethod={redirectMethod}
                  />
                )}
              </div>
            </Card>


          </div>

          {/* Terms only for login and signup */}
          {(viewProp === 'password_signin' || viewProp === 'signup') && (
            <div className="w-full max-w-[400px] mt-2">
              <p className="text-center font-dm-sans font-bold text-[12px] sm:text-[14px] leading-5 tracking-[0.5%] text-fg-text">
                By continuing, you agree to our{' '}
                <Link href="/terms-of-service" className="hover:underline">
                  <span className="font-dm-sans font-bold text-[12px] sm:text-[14px] leading-5 tracking-[0.5%] text-fg-text-contrast">
                    Terms of services
                  </span>
                </Link>{' '}
                and{' '}
                <Link href="/privacy-policy" className="hover:underline">
                  <span className="font-dm-sans font-bold text-[12px] sm:text-[14px] leading-5 tracking-[0.5%] text-fg-text-contrast">
                    Privacy Policy.
                  </span>
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
