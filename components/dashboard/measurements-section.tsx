'use client';

import React, { useState, useEffect } from 'react';
import { SaveChangesButton } from '@/components/ui/buttons';
import MeasurementInput from '@/components/ui/measurement-input/measurement-input';
import { createClient } from '@/lib/utils/supabase/client';

interface MeasurementsSectionProps {
  user: any;
  initialMeasurements?: any;
}

interface Measurements {
  // Your Basics
  height_value: number;
  height_unit: string;
  weight_value: number;
  weight_unit: string;
  
  // Upper Fit
  chest_value: number;
  chest_unit: string;
  waist_value: number;
  waist_unit: string;
  arm_value: number;
  arm_unit: string;
  shoulder_value: number;
  shoulder_unit: string;
  
  // Lower Fit
  hip_value: number;
  hip_unit: string;
  thigh_value: number;
  thigh_unit: string;
  leg_inseam_value: number;
  leg_inseam_unit: string;
}

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
  shoulder_value: 50,
  shoulder_unit: 'cm',
  hip_value: 95,
  hip_unit: 'cm',
  thigh_value: 55,
  thigh_unit: 'cm',
  leg_inseam_value: 80,
  leg_inseam_unit: 'cm',
};

const lengthUnits = [
  { value: 'cm', label: 'cm' },
  { value: 'in', label: 'in' },
];

const weightUnits = [
  { value: 'kg', label: 'kg' },
  { value: 'lbs', label: 'lbs' },
];

export default function MeasurementsSection({ user, initialMeasurements }: MeasurementsSectionProps) {
  const [measurements, setMeasurements] = useState<Measurements>(defaultMeasurements);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const supabase = createClient();

  // Load existing measurements on component mount
  useEffect(() => {
    if (initialMeasurements) {
      // Use pre-fetched measurements
      setMeasurements({
        height_value: initialMeasurements.height_value || defaultMeasurements.height_value,
        height_unit: initialMeasurements.height_unit || defaultMeasurements.height_unit,
        weight_value: initialMeasurements.weight_value || defaultMeasurements.weight_value,
        weight_unit: initialMeasurements.weight_unit || defaultMeasurements.weight_unit,
        chest_value: initialMeasurements.chest_value || defaultMeasurements.chest_value,
        chest_unit: initialMeasurements.chest_unit || defaultMeasurements.chest_unit,
        waist_value: initialMeasurements.waist_value || defaultMeasurements.waist_value,
        waist_unit: initialMeasurements.waist_unit || defaultMeasurements.waist_unit,
        arm_value: initialMeasurements.arm_value || defaultMeasurements.arm_value,
        arm_unit: initialMeasurements.arm_unit || defaultMeasurements.arm_unit,
        shoulder_value: initialMeasurements.shoulder_value || defaultMeasurements.shoulder_value,
        shoulder_unit: initialMeasurements.shoulder_unit || defaultMeasurements.shoulder_unit,
        hip_value: initialMeasurements.hip_value || defaultMeasurements.hip_value,
        hip_unit: initialMeasurements.hip_unit || defaultMeasurements.hip_unit,
        thigh_value: initialMeasurements.thigh_value || defaultMeasurements.thigh_value,
        thigh_unit: initialMeasurements.thigh_unit || defaultMeasurements.thigh_unit,
        leg_inseam_value: initialMeasurements.leg_inseam_value || defaultMeasurements.leg_inseam_value,
        leg_inseam_unit: initialMeasurements.leg_inseam_unit || defaultMeasurements.leg_inseam_unit,
      });
      setIsLoading(false);
    } else {
      loadMeasurements();
    }
  }, [user?.id, initialMeasurements]);

  const loadMeasurements = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_measurements' as any)
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading measurements:', error);
        return;
      }

      if (data) {
        const measurementData = data as any;
        setMeasurements({
          height_value: measurementData.height_value || defaultMeasurements.height_value,
          height_unit: measurementData.height_unit || defaultMeasurements.height_unit,
          weight_value: measurementData.weight_value || defaultMeasurements.weight_value,
          weight_unit: measurementData.weight_unit || defaultMeasurements.weight_unit,
          chest_value: measurementData.chest_value || defaultMeasurements.chest_value,
          chest_unit: measurementData.chest_unit || defaultMeasurements.chest_unit,
          waist_value: measurementData.waist_value || defaultMeasurements.waist_value,
          waist_unit: measurementData.waist_unit || defaultMeasurements.waist_unit,
          arm_value: measurementData.arm_value || defaultMeasurements.arm_value,
          arm_unit: measurementData.arm_unit || defaultMeasurements.arm_unit,
          shoulder_value: measurementData.shoulder_value || defaultMeasurements.shoulder_value,
          shoulder_unit: measurementData.shoulder_unit || defaultMeasurements.shoulder_unit,
          hip_value: measurementData.hip_value || defaultMeasurements.hip_value,
          hip_unit: measurementData.hip_unit || defaultMeasurements.hip_unit,
          thigh_value: measurementData.thigh_value || defaultMeasurements.thigh_value,
          thigh_unit: measurementData.thigh_unit || defaultMeasurements.thigh_unit,
          leg_inseam_value: measurementData.leg_inseam_value || defaultMeasurements.leg_inseam_value,
          leg_inseam_unit: measurementData.leg_inseam_unit || defaultMeasurements.leg_inseam_unit,
        });
      }
    } catch (error) {
      console.error('Error loading measurements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMeasurement = (field: keyof Measurements, value: number | string) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const saveMeasurements = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('user_measurements' as any)
        .upsert({
          user_id: user.id,
          ...measurements,
        }, {
          onConflict: 'user_id',
        });

      if (error) {
        console.error('Error saving measurements:', error);
        return;
      }

      setHasChanges(false);
      // You could add a toast notification here
    } catch (error) {
      console.error('Error saving measurements:', error);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
      {/* Your Basics */}
      <div
        className="bg-white rounded-xl border border-primary-bg shadow-sm flex flex-col lg:flex-row items-stretch overflow-hidden"
        style={{
          borderWidth: '1px 4px 4px 1px',
          borderColor: 'var(--primary-bg)',
        }}
      >
        <div className="w-full lg:w-1/2 p-4 sm:p-5 lg:p-6 bg-primary-bg-subtle flex flex-col items-start lg:min-h-[120px] xl:min-h-[140px] lg:flex-1 text-left">
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
              Your Basics
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
              Essentials to tailor your fit.
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 p-4 sm:p-5 lg:p-6 bg-bg-default flex flex-col gap-4 justify-center">
          <MeasurementInput
            label="Height"
            value={measurements.height_value}
            unit={measurements.height_unit}
            onValueChange={(value) => updateMeasurement('height_value', value)}
            onUnitChange={(unit) => updateMeasurement('height_unit', unit)}
            min={120}
            max={220}
            units={lengthUnits}
            className="w-full"
            measurementType="height"
          />
          <MeasurementInput
            label="Weight"
            value={measurements.weight_value}
            unit={measurements.weight_unit}
            onValueChange={(value) => updateMeasurement('weight_value', value)}
            onUnitChange={(unit) => updateMeasurement('weight_unit', unit)}
            min={30}
            max={200}
            step={0.1}
            units={weightUnits}
            className="w-full"
            measurementType="weight"
          />
          <div className="flex justify-end mt-2">
            <SaveChangesButton
              onClick={saveMeasurements}
              disabled={!hasChanges}
            />
          </div>
        </div>
      </div>

      {/* Upper Fit */}
      <div
        className="bg-white rounded-xl border border-primary-bg shadow-sm flex flex-col lg:flex-row items-stretch overflow-hidden"
        style={{
          borderWidth: '1px 4px 4px 1px',
          borderColor: 'var(--primary-bg)',
        }}
      >
        <div className="w-full lg:w-1/2 p-4 sm:p-5 lg:p-6 bg-primary-bg-subtle flex flex-col items-start lg:min-h-[120px] xl:min-h-[140px] lg:flex-1 text-left">
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
              Upper Fit
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
              Upper body details.
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 p-4 sm:p-5 lg:p-6 bg-bg-default flex flex-col gap-4 justify-center">
          <MeasurementInput
            label="Chest"
            value={measurements.chest_value}
            unit={measurements.chest_unit}
            onValueChange={(value) => updateMeasurement('chest_value', value)}
            onUnitChange={(unit) => updateMeasurement('chest_unit', unit)}
            min={60}
            max={150}
            units={lengthUnits}
            className="w-full"
            measurementType="chest"
          />
          <MeasurementInput
            label="Waist"
            value={measurements.waist_value}
            unit={measurements.waist_unit}
            onValueChange={(value) => updateMeasurement('waist_value', value)}
            onUnitChange={(unit) => updateMeasurement('waist_unit', unit)}
            min={50}
            max={120}
            units={lengthUnits}
            className="w-full"
            measurementType="waist"
          />
          <MeasurementInput
            label="Arm"
            value={measurements.arm_value}
            unit={measurements.arm_unit}
            onValueChange={(value) => updateMeasurement('arm_value', value)}
            onUnitChange={(unit) => updateMeasurement('arm_unit', unit)}
            min={40}
            max={80}
            units={lengthUnits}
            className="w-full"
            measurementType="arm"
          />
          <MeasurementInput
            label="Shoulder"
            value={measurements.shoulder_value}
            unit={measurements.shoulder_unit}
            onValueChange={(value) => updateMeasurement('shoulder_value', value)}
            onUnitChange={(unit) => updateMeasurement('shoulder_unit', unit)}
            min={30}
            max={70}
            units={lengthUnits}
            className="w-full"
            measurementType="shoulder"
          />
          <div className="flex justify-end mt-2">
            <SaveChangesButton
              onClick={saveMeasurements}
              disabled={!hasChanges}
            />
          </div>
        </div>
      </div>

      {/* Lower Fit */}
      <div
        className="bg-white rounded-xl border border-primary-bg shadow-sm flex flex-col lg:flex-row items-stretch overflow-hidden"
        style={{
          borderWidth: '1px 4px 4px 1px',
          borderColor: 'var(--primary-bg)',
        }}
      >
        <div className="w-full lg:w-1/2 p-4 sm:p-5 lg:p-6 bg-primary-bg-subtle flex flex-col items-start lg:min-h-[120px] xl:min-h-[140px] lg:flex-1 text-left">
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
              Lower Fit
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
              Lower body details.
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 p-4 sm:p-5 lg:p-6 bg-bg-default flex flex-col gap-4 justify-center">
          <MeasurementInput
            label="Hip"
            value={measurements.hip_value}
            unit={measurements.hip_unit}
            onValueChange={(value) => updateMeasurement('hip_value', value)}
            onUnitChange={(unit) => updateMeasurement('hip_unit', unit)}
            min={60}
            max={130}
            units={lengthUnits}
            className="w-full"
            measurementType="hip"
          />
          <MeasurementInput
            label="Thigh"
            value={measurements.thigh_value}
            unit={measurements.thigh_unit}
            onValueChange={(value) => updateMeasurement('thigh_value', value)}
            onUnitChange={(unit) => updateMeasurement('thigh_unit', unit)}
            min={40}
            max={80}
            units={lengthUnits}
            className="w-full"
            measurementType="thigh"
          />
          <MeasurementInput
            label="Leg inseam"
            value={measurements.leg_inseam_value}
            unit={measurements.leg_inseam_unit}
            onValueChange={(value) => updateMeasurement('leg_inseam_value', value)}
            onUnitChange={(unit) => updateMeasurement('leg_inseam_unit', unit)}
            min={60}
            max={100}
            units={lengthUnits}
            className="w-full"
            measurementType="leg_inseam"
          />
          <div className="flex justify-end mt-2">
            <SaveChangesButton
              onClick={saveMeasurements}
              disabled={!hasChanges}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 