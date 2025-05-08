'use client';

import { useParams } from 'next/navigation';
import CreatePollForm from '@/components/CreatePollForm';

export default function NewPollPage() {
  const { id: crewId } = useParams();

  if (!crewId) {
    return <p className='text-center mt-8 text-gray-500'>Invalid crew ID.</p>;
  }

  return (
    <div className='max-w-2xl mx-auto px-4 py-10 space-y-6'>
      <h1 className='text-2xl font-extrabold text-purple-700 text-center'>
        Create a New Artist Conflict Poll
      </h1>
      <CreatePollForm crewId={crewId as string} />
    </div>
  );
}
