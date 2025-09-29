'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/client';
import OnboardingBackground from '@/components/onboarding/onboarding-background';
import ProgressPills from '@/components/onboarding/progress-pills';
import MeasurementHelp from '@/components/onboarding/measurement-help';
import MeasurementInput from '@/components/ui/measurement-input/measurement-input';
import PersonalInfoStep from '@/components/onboarding/personal-info-step';
import { YellowButton } from '@/components/ui/buttons';
import { navigateWithLoader } from '@/lib/utils/navigation';
import { TextLogo } from '@/components/ui/text-logo';
import Link from 'next/link';

interface OnboardingClientProps {
  user: any;
  existingMeasurements?: any;
  userDetails?: any;
}

interface PersonalInfo {
  name: string;
  gender: string;
  age: string;
}

interface Measurements {
  height_value: number;
  height_unit: string;
  weight_value: number;
  weight_unit: string;
  chest_value: number;
  chest_unit: string;
  waist_value: number;
  waist_unit: string;
  arm_value: number;
  arm_unit: string;
  shoulder_value: number;
  shoulder_unit: string;
  hip_value: number;
  hip_unit: string;
  thigh_value: number;
  thigh_unit: string;
  leg_inseam_value: number;
  leg_inseam_unit: string;
}

const measurementSteps = [
  {
    key: 'height',
    title: 'Height measurement',
    valueKey: 'height_value' as keyof Measurements,
    unitKey: 'height_unit' as keyof Measurements,
    min: 120,
    max: 220,
    defaultValue: 170,
    units: [
      { value: 'cm', label: 'cm' },
      { value: 'in', label: 'in' }
    ]
  },
  {
    key: 'weight',
    title: 'Weight measurement',
    valueKey: 'weight_value' as keyof Measurements,
    unitKey: 'weight_unit' as keyof Measurements,
    min: 30,
    max: 200,
    defaultValue: 70,
    step: 0.1,
    units: [
      { value: 'kg', label: 'kg' },
      { value: 'lbs', label: 'lbs' }
    ]
  },
  {
    key: 'chest',
    title: 'Chest measurement',
    valueKey: 'chest_value' as keyof Measurements,
    unitKey: 'chest_unit' as keyof Measurements,
    min: 60,
    max: 150,
    defaultValue: 100,
    units: [
      { value: 'cm', label: 'cm' },
      { value: 'in', label: 'in' }
    ]
  },
  {
    key: 'waist',
    title: 'Waist measurement',
    valueKey: 'waist_value' as keyof Measurements,
    unitKey: 'waist_unit' as keyof Measurements,
    min: 50,
    max: 120,
    defaultValue: 80,
    units: [
      { value: 'cm', label: 'cm' },
      { value: 'in', label: 'in' }
    ]
  },
  {
    key: 'arm',
    title: 'Arm measurement',
    valueKey: 'arm_value' as keyof Measurements,
    unitKey: 'arm_unit' as keyof Measurements,
    min: 40,
    max: 80,
    defaultValue: 60,
    units: [
      { value: 'cm', label: 'cm' },
      { value: 'in', label: 'in' }
    ]
  },
  {
    key: 'shoulder',
    title: 'Shoulder measurement',
    valueKey: 'shoulder_value' as keyof Measurements,
    unitKey: 'shoulder_unit' as keyof Measurements,
    min: 30,
    max: 60,
    defaultValue: 45,
    units: [
      { value: 'cm', label: 'cm' },
      { value: 'in', label: 'in' }
    ]
  },
  {
    key: 'hip',
    title: 'Hip measurement',
    valueKey: 'hip_value' as keyof Measurements,
    unitKey: 'hip_unit' as keyof Measurements,
    min: 60,
    max: 130,
    defaultValue: 95,
    units: [
      { value: 'cm', label: 'cm' },
      { value: 'in', label: 'in' }
    ]
  },
  {
    key: 'thigh',
    title: 'Thigh measurement',
    valueKey: 'thigh_value' as keyof Measurements,
    unitKey: 'thigh_unit' as keyof Measurements,
    min: 40,
    max: 80,
    defaultValue: 55,
    units: [
      { value: 'cm', label: 'cm' },
      { value: 'in', label: 'in' }
    ]
  },
  {
    key: 'leg_inseam',
    title: 'Leg inseam measurement',
    valueKey: 'leg_inseam_value' as keyof Measurements,
    unitKey: 'leg_inseam_unit' as keyof Measurements,
    min: 60,
    max: 100,
    defaultValue: 80,
    units: [
      { value: 'cm', label: 'cm' },
      { value: 'in', label: 'in' }
    ]
  }
];

export default function OnboardingClient({
  user,
  existingMeasurements,
  userDetails
}: OnboardingClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Personal info state
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: userDetails?.full_name || 'John Doe',
    gender: 'male',
    age: '18-22'
  });

  // Initialize measurements with defaults or existing data
  const [measurements, setMeasurements] = useState<Measurements>(() => {
    const defaultMeasurements: Measurements = {
      height_value: 170,
      height_unit: 'cm',
      weight_value: 70,
      weight_unit: 'kg',
      chest_value: 100,
      chest_unit: 'cm',
      waist_value: 80,
      waist_unit: 'cm',
      arm_value: 60,
      arm_unit: 'cm',
      shoulder_value: 45,
      shoulder_unit: 'cm',
      hip_value: 95,
      hip_unit: 'cm',
      thigh_value: 55,
      thigh_unit: 'cm',
      leg_inseam_value: 80,
      leg_inseam_unit: 'cm'
    };

    if (existingMeasurements) {
      return { ...defaultMeasurements, ...existingMeasurements };
    }

    return defaultMeasurements;
  });

  const isPersonalInfoStep = currentStep === 0;
  const currentMeasurement = isPersonalInfoStep
    ? null
    : measurementSteps[currentStep - 1];
  const totalSteps = measurementSteps.length + 1; // +1 for personal info step

  // Colors for each step (personal info + measurement steps)
  const stepColors = [
    '#9B59B6', // Step 0 - Personal Info
    '#EB8ACC', // Step 1 - Height
    '#FFAB5A', // Step 2 - Weight
    '#FE6E5F', // Step 3 - Chest
    '#AC8FEA', // Step 4 - Waist
    '#51D6AF', // Step 5 - Arm
    '#E67E22', // Step 6 - Shoulder
    '#EB8ACC', // Step 7 - Hip
    '#FFAB5A', // Step 8 - Thigh
    '#72CEEF' // Step 9 - Leg inseam
  ];

  // Map measurement keys to image filenames with gender-specific paths
  const getImageName = (key: string, gender: string) => {
    const imageMap: Record<string, string> = {
      leg_inseam: 'inseam'
      // Add other mappings if needed
    };
    const baseName = imageMap[key] || key;

    // Return gender-specific image path
    if (gender && ['male', 'female', 'non-binary'].includes(gender)) {
      return `${baseName}-${gender}`;
    }

    // Fallback to base name if no gender is selected
    return baseName;
  };

  const updateMeasurement = (
    field: keyof Measurements,
    value: number | string
  ) => {
    setMeasurements((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContinue = async () => {
    if (currentStep < totalSteps - 1) {
      // If we're on personal info step, validate required fields
      if (isPersonalInfoStep) {
        if (
          !personalInfo.name.trim() ||
          !personalInfo.gender ||
          !personalInfo.age
        ) {
          alert('Please fill in all fields before continuing.');
          return;
        }
        // Save personal info to user table
        setIsLoading(true);
        try {
          const { error: userError } = await supabase
            .from('users')
            .update({
              full_name: personalInfo.name.trim(),
              gender: personalInfo.gender,
              age: personalInfo.age
            })
            .eq('id', user.id);

          if (userError) {
            console.error('Error saving personal info:', userError);
            alert('Failed to save personal information. Please try again.');
            return;
          }
        } catch (error) {
          console.error('Error saving personal info:', error);
          return;
        } finally {
          setIsLoading(false);
        }
      }
      setCurrentStep(currentStep + 1);
    } else {
      // Save all measurements and redirect to landing page
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from('user_measurements' as any)
          .upsert(
            {
              user_id: user.id,
              ...measurements
            },
            {
              onConflict: 'user_id'
            }
          );

        if (error) {
          console.error('Error saving measurements:', error);
          alert('Failed to save measurements. Please try again.');
          return;
        }

        // Measurements saved successfully - redirect to landing page
        navigateWithLoader(router, '/');
      } catch (error) {
        console.error('Error completing onboarding:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

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
          left: '16px'
        }}
      >
        <Link href="/">
          <TextLogo className="w-full h-full" />
        </Link>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-4">
        <div
          className="bg-bg-default flex flex-col items-center w-full max-w-sm sm:max-w-md lg:w-[420px] h-auto lg:h-[520px] border-solid"
          style={{
            borderRadius: '32px',
            borderTopWidth: '2px',
            borderRightWidth: '6px',
            borderBottomWidth: '6px',
            borderLeftWidth: '2px',
            borderColor: 'var(--fg-text-contrast)',
            padding: '24px',
            gap: '20px'
          }}
        >
          {/* Progress Pills - Only show after personal info step */}
          {!isPersonalInfoStep && (
            <div className="w-full max-w-[380px]">
              <ProgressPills
                currentStep={currentStep}
                totalSteps={measurementSteps.length}
              />
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            {isPersonalInfoStep ? (
              /* Personal Info Step */
              <PersonalInfoStep
                name={personalInfo.name}
                gender={personalInfo.gender}
                age={personalInfo.age}
                onNameChange={(name) =>
                  setPersonalInfo((prev) => ({ ...prev, name }))
                }
                onGenderChange={(gender) =>
                  setPersonalInfo((prev) => ({ ...prev, gender }))
                }
                onAgeChange={(age) =>
                  setPersonalInfo((prev) => ({ ...prev, age }))
                }
              />
            ) : (
              /* Measurement Steps */
              <>
                {/* Measurement Image - Responsive dimensions */}
                <div className="rounded-xl bg-bg-bg-subtle flex items-center justify-center overflow-hidden w-full max-w-[380px] h-[180px] relative mb-6">
                  <img
                    src={`/assets/images/on-boarding/${getImageName(currentMeasurement!.key, personalInfo.gender)}.png`}
                    alt={currentMeasurement!.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Try fallback to base image name if gender-specific image doesn't exist
                      const target = e.currentTarget as HTMLImageElement;
                      const baseImageName = getImageName(
                        currentMeasurement!.key,
                        ''
                      );
                      if (
                        target.src.includes('-male') ||
                        target.src.includes('-female') ||
                        target.src.includes('-non-binary')
                      ) {
                        // Try base image name
                        target.src = `/assets/images/on-boarding/${baseImageName}.png`;
                        return;
                      }

                      // Final fallback to placeholder if no image exists
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) {
                        fallback.style.display = 'flex';
                      }
                    }}
                  />
                  <div className="fallback text-fg-text-muted text-center p-4 hidden flex-col items-center justify-center w-full h-full absolute inset-0">
                    <div className="text-2xl sm:text-3xl mb-2">📏</div>
                    <div className="text-xs sm:text-sm">Measurement Visual</div>
                  </div>
                </div>

                {/* Title - Responsive typography */}
                <div className="flex items-center justify-between w-full max-w-[380px] mb-3">
                  <h1
                    className="font-clash-display font-semibold text-fg-text-contrast"
                    style={{
                      fontSize: '24px',
                      lineHeight: '28px',
                      letterSpacing: '0.5%',
                      fontWeight: 600
                    }}
                  >
                    {currentMeasurement!.title}
                  </h1>
                  <MeasurementHelp
                    measurementKey={currentMeasurement!.key}
                    measurementTitle={currentMeasurement!.title}
                  />
                </div>

                {/* Measurement Input - Responsive width */}
                <div className="w-full max-w-[380px]">
                  <MeasurementInput
                    label=""
                    value={measurements[currentMeasurement!.valueKey] as number}
                    unit={measurements[currentMeasurement!.unitKey] as string}
                    onValueChange={(value) =>
                      updateMeasurement(currentMeasurement!.valueKey, value)
                    }
                    onUnitChange={(unit) =>
                      updateMeasurement(currentMeasurement!.unitKey, unit)
                    }
                    min={currentMeasurement!.min}
                    max={currentMeasurement!.max}
                    step={currentMeasurement!.step}
                    units={currentMeasurement!.units}
                    customWidth="100%"
                    customHeight="48px"
                    splitRatio="80/20"
                    stackLayout={true}
                  />
                </div>
              </>
            )}
          </div>

          {/* Continue Button */}
          <div className="w-full max-w-[380px]">
            <YellowButton
              onClick={handleContinue}
              disabled={isLoading}
              backgroundColor={
                isPersonalInfoStep ? '#FFD204' : stepColors[currentStep]
              }
              className="font-medium text-base touch-manipulation h-12 px-8"
            >
              {isLoading
                ? 'Saving...'
                : currentStep === totalSteps - 1
                  ? 'Complete Setup'
                  : 'Continue'}
            </YellowButton>
          </div>

          {/* Privacy Text - Only show on personal info step, below button */}
          {isPersonalInfoStep && (
            <div className="text-left w-full max-w-[380px]">
              <p
                className="font-dm-sans text-fg-text text-left"
                style={{
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '0.5%'
                }}
              >
                Your info stays private and is only used to improve fit
                accuracy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
