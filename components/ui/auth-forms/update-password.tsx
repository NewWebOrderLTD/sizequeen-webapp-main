'use client';

import React, { useState } from 'react';
import { updatePassword } from '@/lib/utils/auth-helpers/server';
import { handleRequest } from '@/lib/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { YellowButton } from '@/components/ui/buttons';
import {
  EyeIcon,
  EyeOffIcon,
  TickIcon,
  CrossIcon,
} from '@/components/ui/icons/index';

interface UpdatePasswordProps {
  redirectMethod: string;
}

export default function UpdatePassword({
  redirectMethod,
}: UpdatePasswordProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isValidLength, setIsValidLength] = useState(false);
  const [containsCharsAndNums, setContainsCharsAndNums] = useState(false);
  const [containsSpecialOrLong, setContainsSpecialOrLong] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPassword(value);
    if (!passwordTouched) {
      setPasswordTouched(true);
    }
    if (value) {
      setIsValidLength(value.length >= 8);
      setContainsCharsAndNums(
        /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value),
      );
      setContainsSpecialOrLong(
        value.length < 12 ? /[!@#$%^&*(),.?":{}|<>]/.test(value) : true,
      );
    } else {
      setIsValidLength(false);
      setContainsCharsAndNums(false);
      setContainsSpecialOrLong(false);
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPasswordConfirm(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, updatePassword, router);
    setIsSubmitting(false);
  };

  const isFormValid =
    password &&
    passwordConfirm &&
    password === passwordConfirm &&
    isValidLength &&
    containsCharsAndNums &&
    containsSpecialOrLong;

  return (
    <>
      <form noValidate={true} onSubmit={(e) => handleSubmit(e)}>
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* New Password Input */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="w-full font-clash-display font-semibold text-[14px] leading-[100%] tracking-[0.5%] text-fg-text-contrast"
            >
              New password
            </label>
            <div className="relative">
              <input
                id="password"
                placeholder="New password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="new-password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full h-10 px-3 py-2 pr-12 rounded-md border border-solid border-fg-text-contrast font-inter text-[14px] focus:outline-none focus:ring-2 focus:ring-primary-solid focus:border-primary-solid transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-fg-text hover:text-fg-text-contrast"
              >
                {showPassword ? (
                  <EyeOffIcon size={16} />
                ) : (
                  <EyeIcon size={16} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="passwordConfirm"
              className="w-full font-clash-display font-semibold text-[14px] leading-[100%] tracking-[0.5%] text-fg-text-contrast"
            >
              Confirm new password
            </label>
            <div className="relative">
              <input
                id="passwordConfirm"
                placeholder="Confirm new password"
                type={showPasswordConfirm ? 'text' : 'password'}
                name="passwordConfirm"
                autoComplete="new-password"
                value={passwordConfirm}
                onChange={handleConfirmPasswordChange}
                className="w-full h-10 px-3 py-2 pr-12 rounded-md border border-solid border-fg-text-contrast font-inter text-[14px] focus:outline-none focus:ring-2 focus:ring-primary-solid focus:border-primary-solid transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-fg-text hover:text-fg-text-contrast"
              >
                {showPasswordConfirm ? (
                  <EyeOffIcon size={16} />
                ) : (
                  <EyeIcon size={16} />
                )}
              </button>
            </div>
          </div>

          {/* Password Validation */}
          {passwordTouched && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {isValidLength ? (
                  <TickIcon size={16} />
                ) : (
                  <CrossIcon size={16} />
                )}
                <span className="font-inter font-normal text-[12px] leading-4 tracking-[0.5%] text-fg-solid whitespace-nowrap">
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-2">
                {containsCharsAndNums ? (
                  <TickIcon size={16} />
                ) : (
                  <CrossIcon size={16} />
                )}
                <span className="font-inter font-normal text-[12px] leading-4 tracking-[0.5%] text-fg-solid whitespace-nowrap">
                  Contains uppercase, lowercase, and numbers
                </span>
              </div>
              <div className="flex items-center gap-2">
                {containsSpecialOrLong ? (
                  <TickIcon size={16} />
                ) : (
                  <CrossIcon size={16} />
                )}
                <span className="font-inter font-normal text-[12px] leading-4 tracking-[0.5%] text-fg-solid whitespace-nowrap">
                  Contains special character or 12+ characters
                </span>
              </div>
              <div className="flex items-center gap-2">
                {password && passwordConfirm && password === passwordConfirm ? (
                  <TickIcon size={16} />
                ) : (
                  <CrossIcon size={16} />
                )}
                <span className="font-inter font-normal text-[12px] leading-4 tracking-[0.5%] text-fg-solid whitespace-nowrap">
                  Passwords match
                </span>
              </div>
            </div>
          )}

          {/* Update Password Button */}
          <YellowButton
            type="submit"
            disabled={!isFormValid}
            loading={isSubmitting}
            loadingText="Updating Password..."
          >
            Update Password
          </YellowButton>
        </div>
      </form>
    </>
  );
}
