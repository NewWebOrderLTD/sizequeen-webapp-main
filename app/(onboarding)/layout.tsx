import React, { PropsWithChildren, Suspense } from 'react';
import { Metadata } from 'next';
import { getURL } from '@/lib/utils';
import 'styles/main.css';
import { Toaster } from '@/components/ui/toasts/toaster';
import { Archivo } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-archivo',
});

const meta = {
  title: 'Complete Your Profile | SizeQueen',
  description: 'Complete your measurements to get personalized recommendations',
  cardImage: '/og.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: getURL(),
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: meta.title,
    description: meta.description,
    referrer: 'origin-when-cross-origin',
    keywords: ['Vercel', 'Supabase', 'Next.js', 'Stripe', 'Subscription'],
    authors: [{ name: 'Vercel', url: 'https://www.newweborder.co/' }],
    creator: 'New',
    publisher: 'Vercel',
    robots: meta.robots,
    icons: { icon: meta.favicon },
    metadataBase: new URL(meta.url),
    openGraph: {
      url: meta.url,
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage],
      type: 'website',
      siteName: meta.title,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@Vercel',
      creator: '@Vercel',
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage],
    },
  };
}

export default async function OnboardingRootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={`${archivo.variable} font-sans`}>
      <body className="loading bg-[#FFF4BE]">
        <NextTopLoader 
          color="#FFD204" 
          showSpinner={false}
          height={3}
          crawl={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #FFD204,0 0 5px #FFD204"
        />
        <main className="min-h-screen">
          {children}
        </main>
        <Suspense>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
} 