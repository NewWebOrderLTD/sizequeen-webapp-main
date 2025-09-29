import React from 'react';
import Link from 'next/link';

interface Link {
  href: string;
  label: string;
  current?: boolean;
}

export const FooterLink: React.FC<Link> = ({ href, label }) => (
  <Link
    href={href}
    target="_blank"
    passHref
    className="hover:text-fg-text-contrast hover:underline"
  >
    {label}
  </Link>
);
