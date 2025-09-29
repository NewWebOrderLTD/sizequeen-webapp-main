'use client';

import React, { useState } from 'react';
import { signInWithOAuth } from '@/lib/utils/auth-helpers/client';
import { type Provider } from '@supabase/supabase-js';
import { GoogleIcon } from '@/components/ui/icons';

type OAuthProviders = {
  name: Provider;
  displayName: string;
  icon: React.JSX.Element;
};

export default function OauthSignIn() {
  const oAuthProviders: OAuthProviders[] = [
    {
      name: 'google',
      displayName: 'Continue with Google',
      icon: <GoogleIcon />,
    },
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await signInWithOAuth(e);
    setIsSubmitting(false);
  };

  return (
    <>
      {oAuthProviders.map((provider) => (
        <form key={provider.name} onSubmit={(e) => handleSubmit(e)}>
          <input type="hidden" name="provider" value={provider.name} />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 flex items-center justify-center gap-2 px-10 py-0 rounded-xl font-clash-display font-semibold text-[15px] leading-[100%] tracking-[0.5%] text-center text-fg-text-contrast transition-colors hover:bg-hover disabled:opacity-50 border-t border-l border-r-4 border-b-4 border-solid"
            style={{
              backgroundColor: '#ECEEF0',
              borderColor: '#11181C',
            }}
          >
            <span>{provider.icon}</span>
            {provider.displayName && <span>{provider.displayName}</span>}
          </button>
        </form>
      ))}
    </>
  );
}
