import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Playfair_Display, Lora, Inter, Montserrat, Barlow_Condensed, DM_Sans, Merriweather } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import 'katex/dist/katex.min.css';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';

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

const barlowCondensed = Barlow_Condensed({
  variable: '--font-barlow-condensed',
  subsets: ['latin'],
  weight: ['700', '900'],
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const merriweather = Merriweather({
  variable: '--font-merriweather',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://discoveringcinema.com'),
  title: {
    default: 'Discovering Cinema',
    template: '%s | Discovering Cinema',
  },
  description: 'Mapping the invisible creative families of cinema. Film history, theory, and criticism that goes beyond the review and the director.',
  openGraph: {
    title: 'Discovering Cinema',
    description: 'Mapping the invisible creative families of cinema. Film history, theory, and criticism that goes beyond the review and the director.',
    type: 'website',
    url: 'https://discoveringcinema.com',
    siteName: 'Discovering Cinema',
  },
  twitter: {
    card: 'summary_large_image',
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
      className={`${playfair.variable} ${lora.variable} ${inter.variable} ${montserrat.variable} ${barlowCondensed.variable} ${dmSans.variable} ${merriweather.variable}`}
    >
      <body className="antialiased overflow-x-clip">
        <Header />
        <main className="mx-auto max-w-5xl px-6">
          {children}
        </main>
        <Footer />
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
