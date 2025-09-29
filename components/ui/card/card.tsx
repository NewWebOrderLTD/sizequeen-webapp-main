import React, { ReactNode } from 'react';
interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
}

export default function Card({ 
  title, 
  description, 
  footer, 
  children,
  titleClassName = '',
  descriptionClassName = ''
}: Props) {
  return (
    <>
      <div className="flex flex-col w-full gap-2">
        {(title || description) && (
          <div className="flex flex-col w-full gap-1">
            {title && (
              <h3 className={`text-lg sm:text-xl font-semibold text-fg-text-contrast font-clash-display ${titleClassName}`}>
                {title}
              </h3>
            )}
            {description && (
              <p className={`text-sm text-fg-text ${descriptionClassName}`}>{description}</p>
            )}
          </div>
        )}
        {children}
      </div>
      {footer && (
        <div className="p-4 border-t rounded-b-md border-zinc-700 bg-zinc-900 text-zinc-500">
          {footer}
        </div>
      )}
    </>
  );
}
