import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { AppProviders } from '@/providers/AppProviders';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ReTempo Wallet – Tempo Network',
  description: 'Your crypto payment wallet powered by Tempo Payment Router. Send, receive, and swap tokens seamlessly.',
  keywords: ['web3', 'wallet', 'crypto', 'tempo', 'blockchain', 'payment'],
  openGraph: {
    title: 'ReTempo Wallet',
    description: 'Send and receive crypto on Tempo Network',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0f1a',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
