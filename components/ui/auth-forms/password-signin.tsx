'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithPassword } from '@/lib/utils/auth-helpers/server';
import { handleRequest } from '@/lib/utils/auth-helpers/client';
import { YellowButton } from '@/components/ui/buttons';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icons';

// Define prop type with allowEmail boolean
interface PasswordSignInProps {
  allowEmail: boolean;
  redirectMethod: string;
}

export const PasswordSignIn = ({
  allowEmail,
  redirectMethod,
}: PasswordSignInProps) => {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, signInWithPassword, router);
    setIsSubmitting(false);
  };

  return (
    <>
      <form noValidate={true} onSubmit={(e) => handleSubmit(e)}>
        <div className="flex flex-col gap-4 sm:gap-6">
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

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="w-full font-clash-display font-semibold text-[14px] leading-[100%] tracking-[0.5%] text-fg-text-contrast"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="w-full h-10 px-3 py-2 pr-12 sm:pr-16 rounded-md border border-solid border-fg-text-contrast font-inter text-[14px] focus:outline-none focus:ring-2 focus:ring-primary-solid focus:border-primary-solid transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-fg-text hover:text-fg-text-contrast"
              >
                {showPassword ? (
                  <EyeIcon size={16} />
                ) : (
                  <EyeOffIcon size={16} />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="w-full">
            <Link
              href="/signin/forgot_password"
              className="font-dm-sans font-medium text-[14px] leading-[20px] tracking-[0.5%] text-fg-text hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Login Button */}
          <YellowButton
            type="submit"
            disabled={!email || !password}
            loading={isSubmitting}
            loadingText="Signing in..."
          >
            Login to Account
          </YellowButton>
        </div>
      </form>
    </>
  );
};
