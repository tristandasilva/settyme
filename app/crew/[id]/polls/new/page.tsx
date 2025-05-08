'use client';

import { useParams } from 'next/navigation';
import PollForm from '@/components/PollForm';
import NavBar from '@/components/NavBar';

export default function NewPollPage() {
  const { id: crewId } = useParams();

  if (!crewId) {
    return <p className='text-center mt-8 text-gray-500'>Invalid crew ID.</p>;
  }

  return (
    <div className='max-w-5xl mx-auto px-4 py-10 space-y-6'>
      <NavBar variant='gradient' />
      {/* <h1 className='text-2xl font-extrabold text-purple-700 text-center'>
        Create a Set Conflict Poll
      </h1> */}
      <PollForm crewId={crewId as string} />
    </div>
  );
}
