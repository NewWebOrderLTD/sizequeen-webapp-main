'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { Slider } from '../slider/slider';
import { ChevronDownIcon } from '../icons';

interface MeasurementInputProps {
  label: string;
  value: number;
  unit: string;
  onValueChange: (value: number) => void;
  onUnitChange: (unit: string) => void;
  min: number;
  max: number;
  step?: number;
  units: { value: string; label: string }[];
  className?: string;
  customWidth?: string;
  customHeight?: string;
  splitRatio?: '80/20' | '65/89';
  stackLayout?: boolean;
  measurementType?: string;
}

// New reusable Value Unit Input Component
interface ValueUnitInputProps {
  value: number;
  unit: string;
  units: { value: string; label: string }[];
  onUnitChange: (unit: string) => void;
  className?: string;
  customWidth?: string;
  customHeight?: string;
  splitRatio?: '80/20' | '65/89';
}

export const ValueUnitInput: React.FC<ValueUnitInputProps> = ({
  value,
  unit,
  units,
  onUnitChange,
  className = '',
  customWidth = '155px',
  customHeight = '64px',
  splitRatio = '65/89',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside (with delay to avoid race conditions)
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is on the button
      if (buttonRef.current && buttonRef.current.contains(target)) {
        return; // Don't close when clicking the button
      }
      
      // Close dropdown with a small delay to allow menu items to be clicked
      setTimeout(() => {
        setIsOpen(false);
      }, 150);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Calculate dimensions based on splitRatio
  const leftWidth = splitRatio === '80/20' 
    ? customWidth === '100%' ? '80%' : `${parseInt(customWidth) * 0.8}px`
    : customWidth === '100%' ? 'calc(100% - 89px)' : '65px';
  const rightWidth = splitRatio === '80/20' 
    ? customWidth === '100%' ? '20%' : `${parseInt(customWidth) * 0.2}px`
    : '89px';

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleUnitSelect = (selectedUnit: string) => {
    // Use setTimeout to ensure the click is processed before closing
    setTimeout(() => {
      onUnitChange(selectedUnit);
      setIsOpen(false);
    }, 0);
  };

  return (
    <div 
      ref={dropdownRef}
      className={`relative inline-flex bg-white border rounded-xl overflow-hidden ${className}`}
      style={{
        width: customWidth,
        height: customHeight,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--primary-on-primary)',
      }}
    >
      {/* Left side - Value display */}
      <div 
        className="flex items-center justify-center bg-white"
        style={{ width: leftWidth, height: customHeight }}
      >
        <span 
          className="font-dm-sans text-fg-text-contrast"
          style={{
            fontWeight: 500,
            fontSize: '15px',
            lineHeight: '100%',
            letterSpacing: '0.5%',
            textAlign: 'center',
          }}
        >
          {value}
        </span>
      </div>

      {/* Right side - Unit selector */}
      <button 
        ref={buttonRef}
        type="button"
        className="relative flex items-center justify-center bg-white cursor-pointer w-full h-full hover:bg-primary-bg-subtle transition-colors focus:outline-none"
        style={{ 
          width: rightWidth, 
          height: customHeight,
          borderLeftWidth: '1px',
          borderLeftStyle: 'solid',
          borderLeftColor: 'var(--primary-on-primary)',
          paddingTop: '8px',
          paddingRight: '12px', 
          paddingBottom: '8px',
          paddingLeft: '12px',
        }}
        onClick={handleToggleDropdown}
      >
        <span 
          className="font-dm-sans text-fg-text-contrast mr-1"
          style={{
            fontWeight: 500,
            fontSize: '15px',
            lineHeight: '100%',
            letterSpacing: '0.5%',
            textAlign: 'center',
          }}
        >
          {unit}
        </span>
        <ChevronDownIcon 
          size={22} 
          className={`transition-transform text-fg-text-contrast ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      <DropdownPortal 
        isOpen={isOpen}
        buttonRef={buttonRef}
        units={units}
        unit={unit}
        onUnitSelect={handleUnitSelect}
      />
    </div>
  );
};

// Dropdown Portal component
const DropdownPortal = ({ 
  isOpen, 
  buttonRef, 
  units, 
  unit, 
  onUnitSelect 
}: {
  isOpen: boolean;
  buttonRef: React.RefObject<HTMLButtonElement>;
  units: { value: string; label: string }[];
  unit: string;
  onUnitSelect: (unit: string) => void;
}) => {
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  
  React.useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate position based on screen size
      let left = rect.right - 120; // Default: align to right edge
      let top = rect.bottom + 4;
      
      // For mobile and tablet, ensure dropdown doesn't go off-screen
      if (viewportWidth < 768) { // Mobile
        left = Math.max(16, Math.min(left, viewportWidth - 120 - 16));
      } else if (viewportWidth < 1024) { // Tablet/iPad
        left = Math.max(24, Math.min(left, viewportWidth - 120 - 24));
        // For iPad, also check if dropdown would go below viewport
        if (top + 120 > viewportHeight - 24) {
          top = rect.top - 120 - 4; // Show above button instead
        }
      }
      
      // Ensure dropdown doesn't go above viewport
      if (top < 24) {
        top = rect.bottom + 4;
      }
      
      setPosition({
        top: top,
        left: left,
      });
    }
  }, [isOpen, buttonRef]);

  if (!isOpen || !isMounted) return null;

  return createPortal(
    <div 
      className="fixed bg-white border rounded-xl shadow-xl"
      style={{ 
        borderWidth: '1px',
        borderColor: 'var(--primary-on-primary)',
        zIndex: 999999,
        minWidth: '89px',
        maxWidth: '120px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        top: position.top,
        left: position.left,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="py-1">
        {units.map((unitOption, index) => (
          <button
            key={unitOption.value}
            type="button"
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 hover:bg-primary-bg-subtle cursor-pointer font-dm-sans text-fg-text-contrast transition-all duration-150 ease-in-out ${
              unit === unitOption.value ? 'bg-primary-bg-subtle text-primary-solid font-semibold' : ''
            } ${
              index === 0 ? 'rounded-t-xl' : ''
            } ${
              index === units.length - 1 ? 'rounded-b-xl' : ''
            }`}
            style={{
              fontWeight: unit === unitOption.value ? 600 : 500,
              fontSize: '14px',
              lineHeight: '100%',
              letterSpacing: '0.5%',
              textAlign: 'left',
              border: 'none',
              background: 'transparent',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onUnitSelect(unitOption.value);
            }}
          >
            {unitOption.label}
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
};

export default function MeasurementInput({
  label,
  value,
  unit,
  onValueChange,
  onUnitChange,
  min,
  max,
  step = 1,
  units,
  className = '',
  customWidth = '155px',
  customHeight = '64px',
  splitRatio = '65/89',
  stackLayout = false,
  measurementType,
}: MeasurementInputProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label */}
      <div className="flex items-center justify-between">
        <label 
          className="font-dm-sans text-fg-text-contrast whitespace-nowrap"
          style={{
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '100%',
            letterSpacing: '0.5%',
          }}
        >
          {label}
        </label>
      </div>

      {stackLayout ? (
        /* Stacked Layout for Onboarding */
        <div className="flex flex-col gap-3">
          {/* Value Display and Unit Selector */}
          <div className="flex justify-center">
            <ValueUnitInput
              value={value}
              unit={unit}
              units={units}
              onUnitChange={onUnitChange}
              customWidth={customWidth}
              customHeight={customHeight}
              splitRatio={splitRatio}
            />
          </div>

          {/* Slider */}
          <div className="flex justify-center">
            <div style={{ width: customWidth }}>
              <Slider
                value={[value]}
                onValueChange={(values) => onValueChange(values[0])}
                min={min}
                max={max}
                step={step}
                customWidth={customWidth}
                className="w-full"
                measurementType={measurementType}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Default Side-by-Side Layout */
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
          {/* Slider */}
          <div className="flex-1 px-2">
            <Slider
              value={[value]}
              onValueChange={(values) => onValueChange(values[0])}
              min={min}
              max={max}
              step={step}
              className="w-full"
              measurementType={measurementType}
            />
          </div>

          {/* Value Display and Unit Selector */}
          <div className="flex justify-center lg:justify-end">
            <ValueUnitInput
              value={value}
              unit={unit}
              units={units}
              onUnitChange={onUnitChange}
              customWidth={customWidth}
              customHeight={customHeight}
              splitRatio={splitRatio}
              className="w-full lg:w-auto max-w-[200px] lg:max-w-[155px]"
            />
          </div>
        </div>
      )}
    </div>
  );
} 