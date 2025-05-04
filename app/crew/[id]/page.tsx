// app/crew/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Crew = {
  id: string;
  name: string;
  festival: string;
};

export default function CrewPage() {
  const { id } = useParams(); // dynamic crew ID from route
  const router = useRouter();
  const [crew, setCrew] = useState<Crew | null>(null);

  useEffect(() => {
    const fetchCrew = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('crew')
        .select('id, name, festival')
        .eq('id', id)
        .single();
      console.log(data, error); // Debugging: log the response from Supabase

      if (error || !data) {
        console.error('Crew not found');
        return router.push('/dashboard');
      }

      setCrew(data);
    };

    fetchCrew();
  }, [id, router]);

  if (!crew) return <p className='text-center mt-20'>Loading...</p>;

  return (
    <div className='max-w-2xl mx-auto mt-10 px-4'>
      <h1 className='text-3xl font-bold mb-2'>{crew.name}</h1>
      <p className='text-lg text-gray-600 mb-6'>Festival: {crew.festival}</p>

      {/* Tool navigation */}
      <div className='flex gap-4 mb-8'>
        <a href={`/crew/${id}/packing`} className='text-purple-600 underline'>
          Packing List
        </a>
        <a href={`/crew/${id}/rideshare`} className='text-purple-600 underline'>
          Rideshare Planner
        </a>
      </div>

      {/* Placeholder for future widgets */}
      <div className='rounded-xl bg-gray-100 p-4 text-center text-gray-500'>
        Select a tool above to get started with your crew 👆
      </div>
    </div>
  );
}
