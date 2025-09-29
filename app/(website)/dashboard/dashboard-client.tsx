'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/client';
import { navigateWithLoader } from '@/lib/utils/navigation';
import { TickIcon, CrossIcon, PremiumLineIcon, PremiumTickIcon } from '@/components/ui/icons';
import { YellowButton, SaveChangesButton } from '@/components/ui/buttons';
import MeasurementsSection from '@/components/dashboard/measurements-section';

export default function DashboardClient({
  session,
  userDetails,
  initialMeasurements,
}: {
  session: any;
  userDetails: any;
  initialMeasurements?: any;
}) {
  const router = useRouter();
  const supabase = createClient();

  const user = session?.user;

  // Toggle state for Profile/Measurements
  const [activeTab, setActiveTab] = useState<'profile' | 'measurements'>(
    'profile',
  );

  // Password validation state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password validation rules
  const isLengthValid = newPassword.length >= 8;
  const hasUpperLowerNumber =
    /[a-z]/.test(newPassword) &&
    /[A-Z]/.test(newPassword) &&
    /[0-9]/.test(newPassword);
  const hasSpecialIfShort =
    newPassword.length >= 12 || /[^a-zA-Z0-9]/.test(newPassword);
  const passwordsMatch =
    newPassword.length > 0 && newPassword === confirmPassword;

  // For Save Changes button enable/disable
  const [nameInput, setNameInput] = useState(userDetails?.full_name ?? '');
  const isNameValid =
    nameInput.trim() !== '' && nameInput !== userDetails?.full_name;

  const [emailInput, setEmailInput] = useState(user ? user.email : '');
  const isEmailValid =
    emailInput.trim() !== '' && emailInput !== (user ? user.email : '');

  const isPasswordValid =
    isLengthValid &&
    hasUpperLowerNumber &&
    hasSpecialIfShort &&
    passwordsMatch &&
    currentPassword.trim() !== '' &&
    newPassword.trim() !== '' &&
    confirmPassword.trim() !== '';

  const updateName = async (formData: FormData) => {
    const newName = formData.get('name') as string;
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .update({ full_name: newName })
        .eq('id', user?.id)
        .select();
      // Handle success/error - you can add toast notifications here
      if (error) {
        console.error(error);
      } else {
        console.log('Name updated:', data);
      }
    }
  };

  const updateEmail = async (formData: FormData) => {
    const newEmail = formData.get('email') as string;
    const { data, error } = await supabase.auth.updateUser({ email: newEmail });
    // Handle success/error - you can add toast notifications here
    if (error) {
      console.error(error);
    } else {
      console.log('Email updated:', data);
    }
  };

  const updatePassword = async (formData: FormData) => {
    const newPassword = formData.get('password') as string;
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    // Handle success/error - you can add toast notifications here
    if (error) {
      console.error(error);
    } else {
      console.log('Password updated:', data);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigateWithLoader(router, '/signin');
  };

  return (
    <section className="min-h-screen bg-bg-base py-4 sm:py-6 lg:py-8 px-4 sm:px-6 md:px-8 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        {/* Dashboard Header with Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
          <h1
            className="font-clash-display font-medium text-fg-text-contrast text-center sm:text-left"
            style={{
              fontSize: '28px',
              lineHeight: '32px',
              letterSpacing: '0.5%',
              fontWeight: 500,
            }}
          >
            Dashboard
          </h1>
        </div>

        {/* Conditional rendering based on active tab */}
        {activeTab === 'profile' ? (
          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
            {/* Upgrade to Premium */}
            <div
              className="bg-white rounded-xl border border-primary-bg shadow-sm flex flex-col md:flex-row items-stretch overflow-hidden"
              style={{
                borderWidth: '1px 4px 4px 1px',
                borderColor: 'var(--primary-bg)',
              }}
            >
              <div className="w-full md:w-1/2 p-4 sm:p-5 lg:p-6 bg-primary-bg-subtle flex flex-col items-start md:min-h-[120px] lg:min-h-[140px] md:flex-1 text-left">
                <div className="flex flex-col w-full">
                  <div
                    className="font-clash-display font-medium text-fg-text-contrast mb-4"
                    style={{
                      fontSize: '20px',
                      lineHeight: '28px',
                      letterSpacing: '0.5%',
                      fontWeight: 500,
                    }}
                  >
                    Upgrade to Premium
                  </div>
                  
                  {/* What's included header */}
                  <div 
                    className="flex items-center gap-2 mb-3"
                    style={{
                      height: '20px',
                      gap: '8px',
                    }}
                  >
                    <span
                      className="font-dm-sans"
                      style={{
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '0.5%',
                        color: '#967200',
                      }}
                    >
                      What's included
                    </span>
                    <PremiumLineIcon width={120} height={2} />
                  </div>

                  {/* Premium features grid */}
                  <div 
                    className="grid grid-cols-2 gap-x-4 gap-y-2"
                    style={{
                      gap: '12px',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <PremiumTickIcon size={17} />
                      <span
                        className="font-dm-sans text-fg-text-contrast text-sm"
                        style={{
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '20px',
                          letterSpacing: '0.5%',
                        }}
                      >
                        100 Fit Scans / Month
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PremiumTickIcon size={17} />
                      <span
                        className="font-dm-sans text-fg-text-contrast text-sm"
                        style={{
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '20px',
                          letterSpacing: '0.5%',
                        }}
                      >
                        Advanced Fit Accuracy
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PremiumTickIcon size={17} />
                      <span
                        className="font-dm-sans text-fg-text-contrast text-sm"
                        style={{
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '20px',
                          letterSpacing: '0.5%',
                        }}
                      >
                        Early New Features Access
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PremiumTickIcon size={17} />
                      <span
                        className="font-dm-sans text-fg-text-contrast text-sm"
                        style={{
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '20px',
                          letterSpacing: '0.5%',
                        }}
                      >
                        Priority Support
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 p-4 sm:p-5 lg:p-6 bg-bg-default flex flex-col gap-4 justify-center items-center">
                {/* Price */}
                <div
                  className="font-plus-jakarta-sans text-fg-text-contrast text-center"
                  style={{
                    fontWeight: 600,
                    fontSize: '60px',
                    lineHeight: '100%',
                    letterSpacing: '0.5%',
                  }}
                >
                  $4.99
                </div>
                
                {/* Subscribe Button */}
                <div className="w-full max-w-[280px]">
                  <YellowButton
                    className="w-full px-4 py-3 rounded-md font-bold text-sm text-primary-on-primary hover:bg-primary-solid-hover transition-colors whitespace-nowrap"
                  >
                    Subscribe to Monthly Plan
                  </YellowButton>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div
              className="bg-white rounded-xl border border-primary-bg shadow-sm flex flex-col md:flex-row items-stretch overflow-hidden"
              style={{
                borderWidth: '1px 4px 4px 1px',
                borderColor: 'var(--primary-bg)',
              }}
            >
              <div className="w-full md:w-1/2 p-4 sm:p-5 lg:p-6 bg-primary-bg-subtle flex flex-col items-start md:min-h-[120px] lg:min-h-[140px] md:flex-1 text-left">
                <div className="flex flex-col w-full">
                  <div
                    className="font-clash-display font-medium text-fg-text-contrast mb-1"
                    style={{
                      fontSize: '20px',
                      lineHeight: '28px',
                      letterSpacing: '0.5%',
                      fontWeight: 500,
                    }}
                  >
                    Personal Information
                  </div>
                  <div
                    className="font-dm-sans text-fg-text-muted max-w-full"
                    style={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '0.5%',
                      fontWeight: 500,
                    }}
                  >
                    The name associated with your account.
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 p-4 sm:p-5 lg:p-6 bg-bg-default flex flex-col gap-3 justify-center">
                <form
                  id="nameForm"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    updateName(formData);
                  }}
                  className="flex flex-col gap-2"
                >
                  <label
                    htmlFor="name"
                    className="font-dm-sans text-fg-text-contrast mb-1 whitespace-nowrap"
                    style={{
                      fontWeight: 600,
                      fontSize: '14px',
                      lineHeight: '100%',
                      letterSpacing: '0.5%',
                    }}
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="border border-fg-text-contrast rounded-md px-3 py-2 text-sm font-medium text-fg-text-contrast bg-white focus:outline-none focus:border-fg-text-contrast focus:ring-2 focus:ring-primary-solid appearance-none"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Your Name"
                    maxLength={64}
                  />
                  <div className="flex justify-end mt-2">
                    <SaveChangesButton
                      type="submit"
                      form="nameForm"
                      disabled={!isNameValid}
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Email */}
            <div
              className="bg-white rounded-xl border border-primary-bg shadow-sm flex flex-col md:flex-row items-stretch overflow-hidden"
              style={{
                borderWidth: '1px 4px 4px 1px',
                borderColor: 'var(--primary-bg)',
              }}
            >
              <div className="w-full md:w-1/2 p-4 sm:p-5 lg:p-6 bg-primary-bg-subtle flex flex-col items-start md:min-h-[120px] lg:min-h-[140px] md:flex-1 text-left">
                <div className="flex flex-col w-full">
                  <div
                    className="font-clash-display font-medium text-fg-text-contrast mb-1"
                    style={{
                      fontSize: '20px',
                      lineHeight: '28px',
                      letterSpacing: '0.5%',
                      fontWeight: 500,
                    }}
                  >
                    Email
                  </div>
                  <div
                    className="font-dm-sans text-fg-text-muted max-w-full"
                    style={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '0.5%',
                      fontWeight: 500,
                    }}
                  >
                    The email address associated with this account.
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 p-4 sm:p-5 lg:p-6 bg-bg-default flex flex-col gap-3 justify-center">
                <form
                  id="emailForm"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    updateEmail(formData);
                  }}
                  className="flex flex-col gap-2"
                >
                  <label
                    htmlFor="email"
                    className="font-dm-sans text-fg-text-contrast mb-1 whitespace-nowrap"
                    style={{
                      fontWeight: 600,
                      fontSize: '14px',
                      lineHeight: '100%',
                      letterSpacing: '0.5%',
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className="border border-fg-text-contrast rounded-md px-3 py-2 text-sm font-medium text-fg-text-contrast bg-white focus:outline-none focus:border-fg-text-contrast focus:ring-2 focus:ring-primary-solid appearance-none"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Email"
                    maxLength={64}
                  />
                  <div className="flex justify-end mt-2">
                    <SaveChangesButton
                      type="submit"
                      form="emailForm"
                      disabled={!isEmailValid}
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Change Password */}
            <div
              className="bg-white rounded-xl border border-primary-bg shadow-sm flex flex-col md:flex-row items-stretch overflow-hidden"
              style={{
                borderWidth: '1px 4px 4px 1px',
                borderColor: 'var(--primary-bg)',
              }}
            >
              <div className="w-full md:w-1/2 p-4 sm:p-5 lg:p-6 bg-primary-bg-subtle flex flex-col items-start md:min-h-[120px] lg:min-h-[140px] md:flex-1 text-left">
                <div className="flex flex-col w-full">
                  <div
                    className="font-clash-display font-medium text-fg-text-contrast mb-1"
                    style={{
                      fontSize: '20px',
                      lineHeight: '28px',
                      letterSpacing: '0.5%',
                      fontWeight: 500,
                    }}
                  >
                    Change Password
                  </div>
                  <div
                    className="font-dm-sans text-fg-text-muted max-w-full"
                    style={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '0.5%',
                      fontWeight: 500,
                    }}
                  >
                    We recommend that you periodically update your password to
                    help prevent unauthorized access to your account.
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 p-4 sm:p-5 lg:p-6 bg-bg-default flex flex-col gap-3 justify-center">
                <form
                  id="passwordForm"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    updatePassword(formData);
                  }}
                  className="flex flex-col gap-2"
                >
                  <label
                    htmlFor="currentPassword"
                    className="font-dm-sans text-fg-text-contrast mb-1 whitespace-nowrap"
                    style={{
                      fontWeight: 600,
                      fontSize: '14px',
                      lineHeight: '100%',
                      letterSpacing: '0.5%',
                    }}
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    className="border border-fg-text-contrast rounded-md px-3 py-2 text-sm font-medium text-fg-text-contrast bg-white focus:outline-none focus:border-fg-text-contrast focus:ring-2 focus:ring-primary-solid appearance-none"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Your Current Password"
                  />
                  <label
                    htmlFor="newPassword"
                    className="font-dm-sans text-fg-text-contrast mb-1 mt-2 whitespace-nowrap"
                    style={{
                      fontWeight: 600,
                      fontSize: '14px',
                      lineHeight: '100%',
                      letterSpacing: '0.5%',
                    }}
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    className="border border-fg-text-contrast rounded-md px-3 py-2 text-sm font-medium text-fg-text-contrast bg-white focus:outline-none focus:border-fg-text-contrast focus:ring-2 focus:ring-primary-solid appearance-none"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Your New Password"
                  />
                  <label
                    htmlFor="confirmPassword"
                    className="font-dm-sans text-fg-text-contrast mb-1 mt-2 whitespace-nowrap"
                    style={{
                      fontWeight: 600,
                      fontSize: '14px',
                      lineHeight: '100%',
                      letterSpacing: '0.5%',
                    }}
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className="border border-fg-text-contrast rounded-md px-3 py-2 text-sm font-medium text-fg-text-contrast bg-white focus:outline-none focus:border-fg-text-contrast focus:ring-2 focus:ring-primary-solid appearance-none"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Your New Password"
                  />
                  {/* Password rules */}
                  <ul className="text-xs mt-2 mb-1 space-y-3">
                    <li className="flex items-center gap-2 text-fg-solid">
                      {isLengthValid ? <TickIcon /> : <CrossIcon />}{' '}
                      <span className="align-middle">
                        Must contain at least 8 characters
                      </span>
                    </li>
                    <li className="flex items-center gap-2 text-fg-solid">
                      {hasUpperLowerNumber ? <TickIcon /> : <CrossIcon />}{' '}
                      <span className="align-middle">
                        Must contain uppercase, lowercase letters, and numbers
                      </span>
                    </li>
                    <li className="flex items-center gap-2 text-fg-solid">
                      {hasSpecialIfShort ? <TickIcon /> : <CrossIcon />}{' '}
                      <span className="align-middle">
                        If less than 12 characters, must contain a special
                        character
                      </span>
                    </li>
                    <li className="flex items-center gap-2 text-fg-solid">
                      {passwordsMatch ? <TickIcon /> : <CrossIcon />}{' '}
                      <span className="align-middle">
                        Both password must match
                      </span>
                    </li>
                  </ul>
                  <div className="flex justify-end mt-2">
                    <SaveChangesButton
                      type="submit"
                      form="passwordForm"
                      disabled={!isPasswordValid}
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Logout */}
            <div
              className="bg-white rounded-xl border border-primary-bg shadow-sm flex flex-col md:flex-row items-stretch overflow-hidden"
              style={{
                borderWidth: '1px 4px 4px 1px',
                borderColor: 'var(--primary-bg)',
              }}
            >
              <div className="w-full md:w-1/2 p-4 sm:p-5 lg:p-6 bg-primary-bg-subtle flex items-center md:min-h-[120px] lg:min-h-[140px] md:flex-1 text-left">
                <div
                  className="font-clash-display font-medium text-fg-text-contrast"
                  style={{
                    fontSize: '20px',
                    lineHeight: '28px',
                    letterSpacing: '0.5%',
                    fontWeight: 500,
                  }}
                >
                  Logout
                </div>
              </div>
              <div className="w-full md:w-1/2 p-4 sm:p-5 lg:p-6 bg-bg-default flex items-center justify-center">
                <div className="w-full max-w-[432px]">
                  <YellowButton
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 rounded-md text-sm font-medium bg-primary-solid text-primary-on-primary hover:bg-primary-solid-hover transition-colors"
                  >
                    Logout
                  </YellowButton>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <MeasurementsSection user={session?.user} initialMeasurements={initialMeasurements} />
        )}
      </div>
    </section>
  );
}
