'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

type Poll = {
  id: string;
  title: string | null;
  artist_1_name: string;
  artist_1_time: string;
  artist_1_stage: string;
  artist_2_name: string;
  artist_2_time: string;
  artist_2_stage: string;
};

type PollFormProps = {
  crewId: string;
  poll?: Poll; // Pass this when editing
  onSubmit?: (updated?: boolean) => void; // Optional callback after submission
};

export default function PollForm({ crewId, poll, onSubmit }: PollFormProps) {
  const supabase = createClient();
  const router = useRouter();

  const [artist1, setArtist1] = useState({
    name: poll?.artist_1_name || '',
    time: poll?.artist_1_time || '',
    stage: poll?.artist_1_stage || '',
  });
  const [artist2, setArtist2] = useState({
    name: poll?.artist_2_name || '',
    time: poll?.artist_2_time || '',
    stage: poll?.artist_2_stage || '',
  });
  const [title, setTitle] = useState(poll?.title || '');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [successMessage, setSuccessMessage] = useState('');

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

    let error;

    if (poll?.id) {
      // Edit existing poll
      const { error: updateError } = await supabase
        .from('polls')
        .update({
          title,
          artist_1_name: artist1.name,
          artist_1_time: artist1.time,
          artist_1_stage: artist1.stage,
          artist_2_name: artist2.name,
          artist_2_time: artist2.time,
          artist_2_stage: artist2.stage,
        })
        .eq('id', poll.id);

      error = updateError;
    } else {
      // Create new poll
      const { error: insertError } = await supabase.from('polls').insert({
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

      error = insertError;
    }

    setLoading(false);

    if (error) {
      setErrorMessage('Something went wrong');
      console.error(error);
    } else {
      setSuccessMessage(poll?.id ? 'Poll updated!' : 'Poll created!');
      if (onSubmit) onSubmit(true);
      else router.push(`/crew/${crewId}/polls`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <h2 className='text-2xl font-bold text-purple-700 text-center'>
        {poll?.id
          ? '✏️ Edit Set Conflict Poll'
          : '🪩 Create a Set Conflict Poll'}
      </h2>

      <input
        placeholder='Title (e.g. "Who are we seeing Friday night?")'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='input-style'
      />

      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='bg-purple-50 p-4 rounded-xl border border-purple-200 space-y-3'>
          <h3 className='font-semibold text-purple-600 text-center'>
            Artist 1
          </h3>
          <input
            placeholder='Name'
            value={artist1.name}
            onChange={(e) => setArtist1({ ...artist1, name: e.target.value })}
            className='input-style'
          />
          <input
            placeholder='Time (e.g. 9:30–11:00)'
            value={artist1.time}
            onChange={(e) => setArtist1({ ...artist1, time: e.target.value })}
            className='input-style'
          />
          <input
            placeholder='Stage'
            value={artist1.stage}
            onChange={(e) => setArtist1({ ...artist1, stage: e.target.value })}
            className='input-style'
          />
        </div>

        <div className='bg-pink-50 p-4 rounded-xl border border-pink-200 space-y-3'>
          <h3 className='font-semibold text-pink-600 text-center'>Artist 2</h3>
          <input
            placeholder='Name'
            value={artist2.name}
            onChange={(e) => setArtist2({ ...artist2, name: e.target.value })}
            className='input-style'
          />
          <input
            placeholder='Time (e.g. 9:45–10:45)'
            value={artist2.time}
            onChange={(e) => setArtist2({ ...artist2, time: e.target.value })}
            className='input-style'
          />
          <input
            placeholder='Stage'
            value={artist2.stage}
            onChange={(e) => setArtist2({ ...artist2, stage: e.target.value })}
            className='input-style'
          />
        </div>
      </div>

      <Button
        type='submit'
        disabled={loading}
        className='w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:opacity-90 transition rounded-xl'
      >
        {loading
          ? poll?.id
            ? 'Saving...'
            : 'Creating...'
          : poll?.id
          ? 'Save Changes'
          : 'Create Poll'}
      </Button>
      {errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}
    </form>
  );
}
