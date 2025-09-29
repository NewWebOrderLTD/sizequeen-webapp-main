'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { requestPasswordUpdate } from '@/lib/utils/auth-helpers/server';
import { handleRequest } from '@/lib/utils/auth-helpers/client';
import { YellowButton } from '@/components/ui/buttons';

// Define prop type with allowEmail boolean
interface ForgotPasswordProps {
  allowEmail: boolean;
  redirectMethod: string;
  disableButton?: boolean;
}

export default function ForgotPassword({
  allowEmail,
  redirectMethod,
}: ForgotPasswordProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, requestPasswordUpdate, router);
    setIsSubmitting(false);
    setEmail('');
  };

  return (
    <>
      <form noValidate={true} onSubmit={(e) => handleSubmit(e)}>
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Email Input */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="w-full font-clash-display font-semibold text-[14px] leading-[100%] tracking-[0.5%] text-fg-text-contrast"
            >
              Email
            </label>
            <input
              id="email"
              placeholder="name@example.com"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className="w-full h-10 px-3 py-2 rounded-md border border-solid border-fg-text-contrast font-inter text-[14px] focus:outline-none focus:ring-2 focus:ring-primary-solid focus:border-primary-solid transition-colors"
            />
          </div>

          {/* Send Reset Instructions Button */}
          <YellowButton
            type="submit"
            disabled={!email}
            loading={isSubmitting}
            loadingText="Sending Instructions..."
          >
            Send reset password instructions
          </YellowButton>
        </div>
      </form>
    </>
  );
}
