'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

export default function BackToCrewButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Extract crew ID from URL
  const segments = pathname.split('/');
  const crewId = segments[1] === 'crew' ? segments[2] : null;

  if (!crewId) return null;

  return (
    <div className='mt-0'>
      <Button
        variant='ghost'
        className='text-purple-700 hover:underline flex items-center gap-1'
        onClick={() => router.push(`/crew/${crewId}`)}
      >
        <ArrowLeft size={16} />
        Back to Crew Page
      </Button>
    </div>
  );
}
