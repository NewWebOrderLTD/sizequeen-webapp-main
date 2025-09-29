import React from 'react';

interface YellowButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  loadingText?: string;
  backgroundColor?: string;
}

export const YellowButton: React.FC<YellowButtonProps> = ({
  children,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
  loadingText,
  backgroundColor = '#FFD204',
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`w-full h-12 flex items-center justify-center gap-2 px-4 sm:px-6 py-0 rounded-xl font-dm-sans font-bold text-[14px] leading-5 tracking-[0.5%] text-center transition-opacity hover:opacity-90 ${className}`}
      style={{
        backgroundColor: backgroundColor,
        color: '#000000',
        borderTop: '1px solid #000000',
        borderRight: '4px solid #000000',
        borderBottom: '4px solid #000000',
        borderLeft: '1px solid #000000',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
      }}
    >
      {loading ? loadingText || 'Loading...' : children}
    </button>
  );
};
