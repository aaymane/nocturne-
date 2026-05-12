import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter_Tight } from 'next/font/google';
import { Providers } from './providers';
import '@/styles/globals.css';

/**
 * Editorial pairing:
 *  - Fraunces: a contemporary "soft serif" with strong italic personality,
 *    used for the oversized display headlines and editorial italics.
 *  - Inter Tight: a refined modern grotesk for body/UI/labels, with tight
 *    metrics that suit the editorial label style (uppercase, wide tracking).
 *
 * Both are loaded with explicit weights to keep the bundle minimal.
 */
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nocturne — Engineered for the Night',
  description:
    'A cinematic editorial — curated objects at the intersection of luxury fashion and automotive cinematography. Filmed in Paris, after dark.',
  openGraph: {
    title: 'Nocturne — Engineered for the Night',
    description: 'A cinematic editorial in motion.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#050505',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${interTight.variable}`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
