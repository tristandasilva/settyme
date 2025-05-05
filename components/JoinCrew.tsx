'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Users } from 'lucide-react';

export default function JoinCrew() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const supabase = createClient();
  const router = useRouter();

  const handleJoin = async () => {
    setError('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return router.push('/login');

    const { data: crew, error: crewError } = await supabase
      .from('crew')
      .select('id')
      .eq('name', code)
      .single();

    if (crewError || !crew) {
      return setError('Crew not found.');
    }

    const { data: existing } = await supabase
      .from('crew_member')
      .select('*')
      .eq('crew_id', crew.id)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return setError('You’re already in this crew.');
    }

    const { error: insertError } = await supabase
      .from('crew_member')
      .insert({ user_id: user.id, crew_id: crew.id });

    if (insertError) {
      setError('Error joining crew.');
    } else {
      router.push(`/crew/${crew.id}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='w-full gap-2 border-2 border-purple-600 text-purple-700 bg-white hover:bg-purple-50 transition'
        >
          <Users size={18} /> Join a Crew
        </Button>
      </DialogTrigger>

      <DialogContent className='space-y-4'>
        <DialogTitle className='text-2xl font-bold text-purple-700 text-center'>
          Join a Crew
        </DialogTitle>

        <input
          type='text'
          placeholder='Enter crew name'
          className='w-full border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 p-3 rounded'
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          onClick={handleJoin}
          className='w-full bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded font-semibold transition'
        >
          Join Crew
        </button>

        {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
      </DialogContent>
    </Dialog>
  );
}
