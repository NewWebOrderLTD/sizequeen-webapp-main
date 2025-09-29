'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { YellowButton } from '@/components/ui/buttons';
import { navigateWithLoader } from '@/lib/utils/navigation';
import { CheckIcon } from '@/components/ui/icons';

interface ResetPasswordProps {
  redirectMethod: string;
}

export default function ResetPassword({ redirectMethod }: ResetPasswordProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have the necessary parameters from the reset link
    const code = searchParams.get('code');
    if (!code) {
      setError('Invalid reset link. Please request a new password reset.');
      setIsLoading(false);
      return;
    }

    // If we have a valid code, we can proceed
    setIsLoading(false);
  }, [searchParams]);

  const handleContinue = () => {
    if (router) {
      navigateWithLoader(router, '/signin/update_password');
    } else {
      window.location.href = '/signin/update_password';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-solid"></div>
        </div>
        <p className="text-center text-fg-text">Verifying reset link...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="text-center">
          <p className="text-alert-text mb-4">{error}</p>
          <div className="flex flex-col gap-2">
            <Link href="/signin/forgot_password">
              <YellowButton>Request New Reset Link</YellowButton>
            </Link>
            <Link
              href="/signin"
              className="text-sm text-fg-text hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="text-center">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success-bg flex items-center justify-center">
            <CheckIcon className="text-success-text" />
          </div>
          <h3 className="text-lg font-semibold text-fg-text-contrast font-clash-display mb-2">
            Reset Link Verified
          </h3>
          <p className="text-fg-text mb-6">
            Your password reset link has been verified successfully. You can now
            proceed to set a new password for your account.
          </p>
        </div>

        <YellowButton onClick={handleContinue}>
          Continue to Set New Password
        </YellowButton>

        <div className="mt-4">
          <Link href="/signin" className="text-sm text-fg-text hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
