'use client';

import Link from 'next/link';
import { footerData, footerLegalData } from '@/lib/constants';
import { DividerLineIcon } from '@/components/ui/icons';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer
      className="bg-bg-base border-t border-fg-line"
      style={{
        minHeight: '160px',
        paddingTop: '40px',
        paddingRight: '16px',
        paddingBottom: '40px',
        paddingLeft: '16px',
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full max-w-screen-xl mx-auto h-full gap-6 lg:gap-0">
        {/* Left - Logo */}
        <div className="flex-1 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start">
            <div
              className="font-nunito-sans font-bold text-black"
              style={{
                fontSize: '22px',
                lineHeight: '100%',
                letterSpacing: '-1%',
                verticalAlign: 'middle',
              }}
            >
              sizequeen
            </div>
          </div>
        </div>

        {/* Middle - Navigation Buttons and Copyright */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <Link
              href={footerData[0].href}
              className="px-3 py-2 text-sm text-fg-text-contrast hover:text-fg-text-contrast transition-colors rounded-md hover:bg-bg-bg-subtle"
            >
              {footerData[0].label}
            </Link>
            <DividerLineIcon />
            <Link
              href={footerData[1].href}
              className="px-3 py-2 text-sm text-fg-text-contrast hover:text-fg-text-contrast transition-colors rounded-md hover:bg-bg-bg-subtle"
            >
              {footerData[1].label}
            </Link>
            <DividerLineIcon />
            <Link
              href={footerData[2].href}
              className="px-3 py-2 text-sm text-fg-text-contrast hover:text-fg-text-contrast transition-colors rounded-md hover:bg-bg-bg-subtle"
            >
              {footerData[2].label}
            </Link>
            <span className="text-sm text-fg-text px-2 text-center">
              © {currentYear} Sizequeen. All rights reserved.
            </span>
          </div>
        </div>

        {/* Right - Terms and Privacy */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="flex items-center gap-3">
            <Link
              href={footerLegalData[0].href}
              className="text-sm text-fg-text hover:text-fg-text-contrast hover:underline transition-colors"
            >
              {footerLegalData[0].label}
            </Link>
            <DividerLineIcon />
            <Link
              href={footerLegalData[1].href}
              className="text-sm text-fg-text hover:text-fg-text-contrast hover:underline transition-colors"
            >
              {footerLegalData[1].label}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
