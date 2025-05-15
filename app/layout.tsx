import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://settyme.com'),
  title: {
    default: 'SetTyme',
    template: '%s | SetTyme',
  },
  description: 'Plan your music festival experience with friends.',
  openGraph: {
    title: 'SetTyme',
    description:
      'Create crews, plan rideshares, vote on artists, and prep for your next festival.',
    url: 'https://settyme.com',
    siteName: 'SetTyme',
    images: [
      {
        url: './favicon.png',
        width: 1200,
        height: 630,
        alt: 'SetTyme Festival Planner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SetTyme',
    description:
      'Create crews, plan rideshares, vote on artists, and prep for your next festival.',
    images: ['./favicon.png'],
  },
  icons: {
    icon: '/favicon.png',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <main className='flex-grow'>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
