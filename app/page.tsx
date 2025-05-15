import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'SetTyme | Plan Your Ultimate Festival Crew Experience',
  description:
    'Create crews, plan rideshares, vote on artists, and get ready for your next festival with SetTyme.',
  openGraph: {
    title: 'SetTyme | Plan Your Ultimate Festival Crew Experience',
    description:
      'Create crews, plan rideshares, vote on artists, and get ready for your next festival with SetTyme.',
    url: 'https://settyme.com',
    siteName: 'SetTyme',
    images: [
      {
        url: 'https://settyme.com/og-image.png', // change to your actual image path
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
    title: 'SetTyme | Plan Your Ultimate Festival Crew Experience',
    description:
      'Create crews, plan rideshares, vote on artists, and get ready for your next festival with SetTyme.',
    images: ['https://settyme.com/og-image.png'], // same image or another one
  },
};

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  redirect(user ? '/dashboard' : '/login');
}
