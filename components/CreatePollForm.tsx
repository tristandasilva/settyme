'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

type Props = {
  crewId: string;
};

export default function CreatePollForm({ crewId }: Props) {
  const supabase = createClient();
  const router = useRouter();

  const [artist1, setArtist1] = useState({ name: '', time: '', stage: '' });
  const [artist2, setArtist2] = useState({ name: '', time: '', stage: '' });
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return router.push('/login');
    }

    const { error } = await supabase.from('polls').insert({
      creator_id: user.id,
      title,
      crew_id: crewId,
      artist_1_name: artist1.name,
      artist_1_time: artist1.time,
      artist_1_stage: artist1.stage,
      artist_2_name: artist2.name,
      artist_2_time: artist2.time,
      artist_2_stage: artist2.stage,
    });

    setLoading(false);

    if (error) {
      alert('Error creating poll');
      console.error(error);
    } else {
      alert('Poll created!');
      router.push(`/crew/${crewId}/polls`); // Adjust based on where your poll list lives
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4 max-w-xl mx-auto'>
      <h2 className='text-xl font-bold text-purple-700'>
        Create a Set Conflict Poll
      </h2>

      <input
        placeholder='Optional title (e.g. "Who are we seeing Friday night?")'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='border border-purple-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-purple-500'
      />

      <div className='grid gap-2'>
        <h3 className='font-semibold text-purple-600'>Artist 1</h3>
        <input
          placeholder='Name'
          value={artist1.name}
          onChange={(e) => setArtist1({ ...artist1, name: e.target.value })}
          className='border border-purple-300 p-2 rounded'
        />
        <input
          placeholder='Time (e.g. 9:30–11:00)'
          value={artist1.time}
          onChange={(e) => setArtist1({ ...artist1, time: e.target.value })}
          className='border border-purple-300 p-2 rounded'
        />
        <input
          placeholder='Stage'
          value={artist1.stage}
          onChange={(e) => setArtist1({ ...artist1, stage: e.target.value })}
          className='border border-purple-300 p-2 rounded'
        />
      </div>

      <div className='grid gap-2'>
        <h3 className='font-semibold text-purple-600'>Artist 2</h3>
        <input
          placeholder='Name'
          value={artist2.name}
          onChange={(e) => setArtist2({ ...artist2, name: e.target.value })}
          className='border border-purple-300 p-2 rounded'
        />
        <input
          placeholder='Time (e.g. 9:45–10:45)'
          value={artist2.time}
          onChange={(e) => setArtist2({ ...artist2, time: e.target.value })}
          className='border border-purple-300 p-2 rounded'
        />
        <input
          placeholder='Stage'
          value={artist2.stage}
          onChange={(e) => setArtist2({ ...artist2, stage: e.target.value })}
          className='border border-purple-300 p-2 rounded'
        />
      </div>

      <Button
        type='submit'
        className='w-full bg-gradient-to-r from-purple-600 to-pink-500'
      >
        {loading ? 'Creating...' : 'Create Poll'}
      </Button>
    </form>
  );
}
