'use client';

import React from 'react';
import Input from '@/components/ui/input/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select/select';

interface PersonalInfoStepProps {
  name: string;
  gender: string;
  age: string;
  onNameChange: (name: string) => void;
  onGenderChange: (gender: string) => void;
  onAgeChange: (age: string) => void;
}

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-Binary' },
];

const ageOptions = [
  { value: '18-22', label: '18-22' },
  { value: '23-26', label: '23-26' },  
  { value: '27-30', label: '27-30' },
  { value: '31-35', label: '31-35' },
  { value: '36-40', label: '36-40' },
  { value: '41-45', label: '41-45' },
  { value: '46-50', label: '46-50' },
  { value: '51-55', label: '51-55' },
  { value: '56-60', label: '56-60' },
  { value: '60+', label: '60+' },
];

export default function PersonalInfoStep({
  name,
  gender,
  age,
  onNameChange,
  onGenderChange,
  onAgeChange,
}: PersonalInfoStepProps) {
  return (
    <div className="w-full max-w-[380px] flex flex-col" style={{ gap: '8px' }}>
      {/* Title */}
      <div className="mb-4">
        <h1 
          className="font-clash-display text-fg-text-contrast mb-2 text-center"
          style={{
            fontWeight: 600,
            fontSize: '30px',
            lineHeight: '36px',
            letterSpacing: '0.5%',
            verticalAlign: 'middle',
          }}
        >
          Let's Personalize Your Fit
        </h1>
        <p 
          className="font-dm-sans text-fg-text text-left"
          style={{
            fontWeight: 500,
            fontSize: '18px',
            lineHeight: '28px',
            letterSpacing: '0.5%',
          }}
        >
          We need to know a little more about you.
        </p>
      </div>

      {/* Name Input */}
      <div className="flex flex-col mb-3">
        <Label 
          htmlFor="name"
          className="font-dm-sans text-fg-text-contrast mb-1 text-left"
          style={{
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '100%',
            letterSpacing: '0.5%',
          }}
        >
          Name
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Christina Ray"
          className="font-inter text-[14px] h-12 w-full px-4 py-3 rounded-xl border border-solid"
          style={{
            border: '1px solid #11181C',
          }}
        />
      </div>

      {/* Gender Select */}
      <div className="flex flex-col mb-3">
        <Label 
          htmlFor="gender"
          className="font-dm-sans text-fg-text-contrast mb-1 text-left"
          style={{
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '100%',
            letterSpacing: '0.5%',
          }}
        >
          Gender
        </Label>
        <Select value={gender} onValueChange={onGenderChange}>
          <SelectTrigger 
            className="font-inter text-[14px] h-12 w-full px-4 py-3 rounded-xl border border-solid"
            style={{
              border: '1px solid #11181C',
            }}
          >
            <SelectValue placeholder="Female" />
          </SelectTrigger>
          <SelectContent>
            {genderOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Age Select */}
      <div className="flex flex-col">
        <Label 
          htmlFor="age"
          className="font-dm-sans text-fg-text-contrast mb-1 text-left"
          style={{
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '100%',
            letterSpacing: '0.5%',
          }}
        >
          Age
        </Label>
        <Select value={age} onValueChange={onAgeChange}>
          <SelectTrigger 
            className="font-inter text-[14px] h-12 w-full px-4 py-3 rounded-xl border border-solid"
            style={{
              border: '1px solid #11181C',
            }}
          >
            <SelectValue placeholder="18-22" />
          </SelectTrigger>
          <SelectContent>
            {ageOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 