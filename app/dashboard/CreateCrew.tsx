'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client'; // Supabase client for database operations
import { useRouter } from 'next/navigation';

export default function CreateCrew() {
  const [name, setName] = useState('');
  const [festival, setFestival] = useState('');
  const router = useRouter();

  const handleCreate = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('crews')
      .insert([{ name, festival, created_by: user.id }])
      .select()
      .single();

    if (data && !error) {
      await supabase
        .from('crew_members')
        .insert([{ user_id: user.id, crew_id: data.id }]);
      router.push(`/crew/${data.id}`);
    } else {
      alert(error?.message);
    }
  };

  return (
    <div className='max-w-sm mx-auto mt-10'>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='Crew Name'
        className='border p-2 w-full mb-3'
      />
      <input
        value={festival}
        onChange={(e) => setFestival(e.target.value)}
        placeholder='Festival Name'
        className='border p-2 w-full mb-3'
      />
      <button
        onClick={handleCreate}
        className='bg-green-600 text-white px-4 py-2 rounded w-full'
      >
        Create Crew
      </button>
      <button
        onClick={async () => {
          const supabase = createClient();
          await supabase.auth.signOut();
          router.push('/login');
        }}
      >
        Log out
      </button>
    </div>
  );
}
