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
  // Explicit preload — this is the LCP font (logo + headlines).
  preload: true,
  // Fallback lets the browser size/place the element immediately before the
  // real font arrives, so the LCP element is visible from first paint.
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'Arial', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nocturne-six-eosin.vercel.app'),

  title: {
    default: 'Nocturne — The Nightcrest Cap',
    template: '%s · Nocturne',
  },
  description:
    'A cinematic editorial. Curated objects at the intersection of luxury fashion and automotive cinematography. Filmed in Paris, after dark.',

  keywords: ['Nocturne', 'Nightcrest', 'cap', 'luxury', 'Paris', 'editorial', 'cinematic', 'fashion'],
  authors: [{ name: 'Nocturne Atelier' }],
  creator: 'Nocturne Atelier',
  publisher: 'Nocturne Atelier',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nocturne-six-eosin.vercel.app',
    siteName: 'Nocturne',
    title: 'Nocturne — The Nightcrest Cap',
    description: 'A cinematic editorial. Filmed in Paris, after dark. Edition 01 — 200 numbered pieces.',
    // opengraph-image.png in app/ is auto-detected by Next.js metadata API
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Nocturne — The Nightcrest Cap',
    description: 'A cinematic editorial. Filmed in Paris, after dark. Edition 01 — 200 numbered pieces.',
    // twitter-image.png in app/ is auto-detected
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
