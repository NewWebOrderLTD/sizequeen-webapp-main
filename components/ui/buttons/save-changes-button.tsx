import React from 'react';

interface SaveChangesButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  form?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function SaveChangesButton({
  disabled = false,
  onClick,
  type = 'button',
  form,
  children = 'Save Changes',
  className = '',
  ...props
}: SaveChangesButtonProps) {
  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-[127px] h-10 
        px-4 py-0 
        gap-2 
        rounded-xl
        text-sm font-medium
        transition-colors
        font-dm-sans
        whitespace-nowrap
        ${
    disabled
      ? 'bg-bg-bg-subtle text-fg-text cursor-not-allowed border-button-border'
      : 'bg-bg-bg-subtle text-fg-text-contrast hover:bg-bg-bg-hover border-button-border hover:border-button-border'
    }
        ${className}
      `}
      style={{
        borderWidth: '1px 3px 3px 1px',
        borderStyle: 'solid',
      }}
      {...props}
    >
      {children}
    </button>
  );
}
