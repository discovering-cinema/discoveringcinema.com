import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import 'katex/dist/katex.min.css';
import Footer from '@/app/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://discoveringcinema.com'),
  title: 'Discovering Cinema',
  description: 'Mapping the invisible creative families of cinema.',
  openGraph: {
    title: 'Discovering Cinema',
    description: 'Mapping the invisible creative families of cinema.',
    type: 'website',
    url: 'https://discoveringcinema.com',
    siteName: 'Discovering Cinema',
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
