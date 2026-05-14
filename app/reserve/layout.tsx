import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reserve your Edition',
  description: 'Reserve The Nightcrest Cap — Edition 01. 200 numbered pieces. Crafted in Paris.',
  openGraph: {
    title: 'Reserve · Nocturne',
    description: 'Reserve The Nightcrest Cap — Edition 01. 200 numbered pieces. Crafted in Paris.',
  },
  twitter: {
    title: 'Reserve · Nocturne',
    description: 'Reserve The Nightcrest Cap — Edition 01. 200 numbered pieces. Crafted in Paris.',
  },
};

export default function ReserveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
