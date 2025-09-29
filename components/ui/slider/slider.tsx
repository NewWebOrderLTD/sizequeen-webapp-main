'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';
import { PatternSVG } from '@/components/ui/icons';

// Function to get colors based on measurement type
const getMeasurementColors = (measurementType?: string) => {
  const colorMap: Record<string, { base: string; light: string }> = {
    height: { base: '#EB8ACC', light: '#F5C8E4' },
    weight: { base: '#FFAB5A', light: '#FFD5AA' },
    chest: { base: '#FE6E5F', light: '#FFB7AF' },
    waist: { base: '#AC8FEA', light: '#D6C7F5' },
    arm: { base: '#51D6AF', light: '#A8EBD7' },
    shoulder: { base: '#FFD204', light: '#FFEC9A' },
    hip: { base: '#EB8ACC', light: '#F5C8E4' },
    thigh: { base: '#FFAB5A', light: '#FFD5AA' },
    leg_inseam: { base: '#72CEEF', light: '#B9E7F7' },
  };

  return colorMap[measurementType || 'shoulder'] || colorMap.shoulder;
};

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    customWidth?: string;
    measurementType?: string;
  }
>(({ className, customWidth, measurementType, ...props }, ref) => {
  const value = props.value?.[0] || 0;
  const min = props.min || 0;
  const max = props.max || 100;
  
  // Calculate the percentage for the pattern
  const percentage = ((value - min) / (max - min)) * 100;
  
  // Get colors based on measurement type
  const colors = getMeasurementColors(measurementType);
  
  // For percentage-based widths, use a large default width for pattern calculation
  // For pixel widths, parse the value
  let sliderWidth = 258; // Default width
  if (customWidth) {
    if (customWidth.includes('%')) {
      // For percentage widths, assume a reasonable container width
      sliderWidth = 320; // Assume container width for percentage calculations
    } else {
      sliderWidth = parseInt(customWidth.replace('px', ''));
    }
  }
  
  // Enhanced pattern calculation for better coverage across all devices
  const trackWidth = sliderWidth - 10; // Account for borders and padding
  const thumbWidth = 32;
  const thumbRadius = thumbWidth / 2;
  
  // Better pattern calculation with improved coverage for iPad and other devices
  const basePatternWidth = (percentage / 100) * trackWidth;
  const thumbCenterOffset = (percentage / 100) * thumbRadius;
  
  // Add extra coverage to ensure full pattern visibility
  // Increased extra coverage for better iPad support
  const extraCoverage = Math.min(16, percentage * 0.2); // Dynamic extra coverage based on position
  const patternWidth = Math.max(0, Math.min(
    basePatternWidth + thumbCenterOffset + extraCoverage,
    trackWidth + thumbRadius // Don't exceed track bounds plus thumb radius
  ));

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        className,
      )}
      style={{ width: customWidth || '258px', height: '32px' }}
      {...props}
    >
      <SliderPrimitive.Track 
        className="relative w-full grow overflow-hidden rounded-xl"
        style={{
          height: '18px',
          borderWidth: '1px 4px 4px 1px',
          borderStyle: 'solid',
          borderColor: 'var(--primary-on-primary)',
          backgroundColor: colors.light,
        }}
      >
        <SliderPrimitive.Range className="absolute h-full overflow-hidden rounded-xl">
          <PatternSVG 
            width={patternWidth} 
            color={colors.base} 
            lightColor={colors.light} 
          />
        </SliderPrimitive.Range>
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb 
        className="block rounded-full bg-white border border-fg-text-contrast transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        style={{
          width: '32px',
          height: '32px',
          borderWidth: '1px',
          borderColor: 'var(--fg-text-contrast)',
          boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.05) inset',
        }}
      />
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider }; 