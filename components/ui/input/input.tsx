import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function Input(props: InputProps) {
  const { className, ...rest } = props;

  return (
    <input
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      className={cn(
        'h-10 w-full rounded-lg border border-fg-line bg-transparent px-3.5 text-sm font-medium text-fg-text-contrast outline-none placeholder:text-fg-solid hover:border-fg-border focus:border-fg-border disabled:cursor-default disabled:opacity-50',
        className,
      )}
      {...rest}
    />
  );
}
