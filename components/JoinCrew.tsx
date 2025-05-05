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

    // Try to find crew by name (or invite code if you use one)
    const { data: crew, error: crewError } = await supabase
      .from('crew')
      .select('id')
      .eq('name', code) // could also be invite_code
      .single();

    if (crewError || !crew) {
      return setError('Crew not found.');
    }

    // Check if already a member
    const { data: existing } = await supabase
      .from('crew_member')
      .select('*')
      .eq('crew_id', crew.id)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return setError('You’re already in this crew.');
    }

    // Join the crew
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
          className='w-full gap-2 text-purple-700 border-purple-700 hover:bg-purple-50'
        >
          <Users size={18} /> Join a Crew
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Join a Crew</DialogTitle>
        <input
          type='text'
          placeholder='Enter crew name'
          className='w-full border p-2 rounded'
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          onClick={handleJoin}
          className='bg-purple-600 text-white px-4 py-2 rounded w-full'
        >
          Join
        </button>
        {error && <p className='text-red-500 text-sm mt-4'>{error}</p>}
      </DialogContent>
    </Dialog>
  );
}
