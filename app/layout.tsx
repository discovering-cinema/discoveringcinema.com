import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Playfair_Display, Lora, Inter, Montserrat } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import 'katex/dist/katex.min.css';
import Footer from '@/app/components/Footer';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '700'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '700'],
});

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '700'],
});

const inter = Inter({
  variable: '--font-inter',
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
    <html
      lang="en"
      className={`${playfair.variable} ${lora.variable} ${inter.variable} ${montserrat.variable} overflow-x-hidden`}
    >
      <body className="antialiased overflow-x-hidden">
        <main className="mx-auto max-w-5xl px-6">
          {children}
          <Footer />
        </main>
        <Analytics />
        <SpeedInsights />
        {process.env.NODE_ENV === 'production' &&
          process.env.NEXT_PUBLIC_GA_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          )}
      </body>
    </html>
  );
}
