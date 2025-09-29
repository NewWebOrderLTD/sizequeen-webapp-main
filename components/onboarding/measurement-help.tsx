'use client';

import React, { useState } from 'react';
import { InfoIcon, CloseIcon } from '@/components/ui/icons';

interface MeasurementHelpProps {
  measurementKey: string;
  measurementTitle: string;
}

const measurementInstructions: Record<string, { title: string; steps: string[]; tip: string }> = {
  height: {
    title: 'How to Measure Your Height Accurately',
    steps: [
      'Stand straight against a flat wall, barefoot or in thin socks.',
      'Keep heels, back, and head touching the wall.',
      'Use a flat object (like a book) on your head, making it level.',
      'Mark the point where the object touches the wall.', 
      'Measure the distance from the floor to the mark.',
    ],
    tip: 'Ask a friend to help or use your phone\'s Measure app.',
  },
  weight: {
    title: 'How to Measure Your Weight Accurately',
    steps: [
      'Use a digital scale on a hard, flat surface.',
      'Weigh yourself at the same time each day, preferably in the morning.',
      'Wear minimal clothing or the same type of clothing each time.',
      'Step on the scale with both feet evenly distributed.',
      'Stand still and wait for the reading to stabilize.',
    ],
    tip: 'For consistency, weigh yourself after using the bathroom and before eating.',
  },
  chest: {
    title: 'How to Measure Your Chest Accurately',
    steps: [
      'Stand straight with arms relaxed at your sides.',
      'Wrap the measuring tape around the fullest part of your chest.',
      'Keep the tape parallel to the floor and snug but not tight.',
      'Take a normal breath and measure at the end of a normal exhale.',
      'Record the measurement to the nearest half inch or centimeter.',
    ],
    tip: 'Have someone help you ensure the tape is level all around your back.',
  },
  waist: {
    title: 'How to Measure Your Waist Accurately', 
    steps: [
      'Stand straight and relax your stomach.',
      'Find your natural waistline (narrowest part of your torso).',
      'Wrap the measuring tape around your waist at this point.',
      'Keep the tape snug but not compressing your skin.',
      'Breathe normally and measure after a gentle exhale.',
    ],
    tip: 'Your natural waist is usually about 1 inch above your belly button.',
  },
  arm: {
    title: 'How to Measure Your Arm Accurately',
    steps: [
      'Flex your arm and find the largest part of your bicep.',
      'Keep your arm flexed while measuring.',
      'Wrap the measuring tape around the fullest part of your upper arm.',
      'Keep the tape snug but not tight.',
      'Record the measurement while your muscle is still flexed.',
    ],
    tip: 'Measure your dominant arm for consistency, or measure both and use the larger measurement.',
  },
  hip: {
    title: 'How to Measure Your Hips Accurately',
    steps: [
      'Stand with feet together and weight evenly distributed.',
      'Find the widest part of your hips and buttocks.',
      'Wrap the measuring tape around this fullest part.',
      'Keep the tape parallel to the floor and comfortably snug.',
      'Ensure the tape isn\'t twisted and lies flat against your body.',
    ],
    tip: 'Use a mirror or have someone help ensure the tape is level all around.',
  },
  thigh: {
    title: 'How to Measure Your Thigh Accurately',
    steps: [
      'Stand with feet slightly apart and weight evenly distributed.',
      'Find the largest part of your thigh, usually near the top.',
      'Wrap the measuring tape around the fullest part of your thigh.',
      'Keep the tape snug but not compressing the muscle.',
      'Ensure the tape is parallel to the floor.',
    ],
    tip: 'Measure your dominant leg or measure both and use the larger measurement.',
  },
  leg_inseam: {
    title: 'How to Measure Your Leg Inseam Accurately',
    steps: [
      'Stand straight against a wall wearing well-fitting pants.',
      'Place a book between your legs, spine up against your crotch.',
      'Mark where the top of the book meets the wall.',
      'Measure from this mark straight down to the floor.',
      'This is your inseam measurement.',
    ],
    tip: 'Alternatively, measure the inseam of pants that fit you perfectly.',
  },
};

export default function MeasurementHelp({ measurementKey, measurementTitle }: MeasurementHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const instructions = measurementInstructions[measurementKey];

  if (!instructions) return null;

  return (
    <>
      {/* Info Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="ml-2 hover:opacity-70 transition-opacity"
      >
        <InfoIcon />
      </button>

      {/* Mobile Popup Overlay */}
      {isOpen && (
        <div className="block md:hidden fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div 
            className="bg-bg-default rounded-2xl sm:rounded-3xl flex flex-col w-full max-w-sm sm:max-w-md h-auto max-h-[80vh] overflow-hidden"
            style={{
              borderTopWidth: '2px',
              borderRightWidth: '4px', 
              borderBottomWidth: '4px',
              borderLeftWidth: '2px',
              borderStyle: 'solid',
              borderColor: '#11181C',
              padding: '24px',
              gap: '24px',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 
                className="font-clash-display font-semibold text-fg-text-contrast"
                style={{
                  fontSize: '18px',
                  lineHeight: '22px',
                  letterSpacing: '0.5%',
                  fontWeight: 600,
                }}
              >
                {instructions.title}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:opacity-70 transition-opacity"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
              {/* Steps */}
              <div className="space-y-3">
                {instructions.steps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <span 
                      className="flex-shrink-0 w-6 h-6 text-primary-on-primary flex items-center justify-center font-dm-sans font-semibold text-xs"
                    >
                      {index + 1}
                    </span>
                    <p 
                      className="font-dm-sans text-fg-text-contrast flex-1"
                      style={{
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '0.5%',
                      }}
                    >
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tip */}
              <div 
                className="mt-4 p-3 bg-primary-bg rounded-lg"
                style={{
                  backgroundColor: 'var(--primary-bg-subtle)',
                }}
              >
                <p 
                  className="font-dm-sans text-fg-text-contrast"
                  style={{
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '0.5%',
                  }}
                >
                  ✅ Tip: {instructions.tip}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop/Tablet Side Panel */}
      {isOpen && (
        <div className="hidden md:block fixed z-50" 
             style={{
               left: 'min(calc(50% + 180px + 24px), calc(100vw - 320px - 16px))', // Position to the right with overflow protection
               top: '50%',
               transform: 'translateY(-50%)',
               width: 'min(320px, calc(100vw - 16px))', // Responsive width with minimum margins
               maxHeight: '80vh'
             }}>
          <div 
            className="bg-bg-default rounded-2xl flex flex-col h-auto max-h-[80vh] overflow-hidden shadow-2xl"
            style={{
              borderTopWidth: '2px',
              borderRightWidth: '4px', 
              borderBottomWidth: '4px',
              borderLeftWidth: '2px',
              borderStyle: 'solid',
              borderColor: '#11181C',
              padding: '24px',
              gap: '24px',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 
                className="font-clash-display font-semibold text-fg-text-contrast"
                style={{
                  fontSize: '18px',
                  lineHeight: '22px',
                  letterSpacing: '0.5%',
                  fontWeight: 600,
                }}
              >
                {instructions.title}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:opacity-70 transition-opacity"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
              {/* Steps */}
              <div className="space-y-3">
                {instructions.steps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <span 
                      className="flex-shrink-0 w-6 h-6 text-primary-on-primary flex items-center justify-center font-dm-sans font-semibold text-xs"
                    >
                      {index + 1}
                    </span>
                    <p 
                      className="font-dm-sans text-fg-text-contrast flex-1"
                      style={{
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '0.5%',
                      }}
                    >
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tip */}
              <div 
                className="mt-4 p-3 bg-primary-bg rounded-lg"
                style={{
                  backgroundColor: 'var(--primary-bg-subtle)',
                }}
              >
                <p 
                  className="font-dm-sans text-fg-text-contrast"
                  style={{
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '0.5%',
                  }}
                >
                  ✅ Tip: {instructions.tip}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 