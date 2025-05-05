'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client'; // Supabase client for database operations
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';

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
      .from('crew')
      .insert([{ name, festival, created_by: user.id }])
      .select()
      .single();

    if (data && !error) {
      await supabase
        .from('crew_member')
        .insert([{ user_id: user.id, crew_id: data.id }]);
      router.push(`/crew/${data.id}`);
    } else {
      alert(error?.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='default'
          className='w-full gap-2 bg-purple-700 hover:bg-purple-800'
        >
          <PlusCircle size={18} /> Create Crew
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create a Crew</DialogTitle>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Crew Name'
          className='border p-2 rounded'
        />
        <input
          value={festival}
          onChange={(e) => setFestival(e.target.value)}
          placeholder='Festival Name'
          className='w-full border p-2 rounded mb-3'
        />
        <button
          onClick={handleCreate}
          className='bg-green-600 text-white px-4 py-2 rounded w-full'
        >
          Create Crew
        </button>
      </DialogContent>
    </Dialog>
  );
}
