'use client';

import { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { createClient } from '@/lib/supabase/client';

type Props = {
  crew: {
    id: string;
    name: string;
    festival: string;
  };
  onSave?: (updated: { id: string; name: string; festival: string }) => void;
};

export default function CrewEditDialog({ crew, onSave }: Props) {
  const [name, setName] = useState(crew.name);
  const [festival, setFestival] = useState(crew.festival);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const supabase = createClient();

  const handleSave = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    if (!name || !festival) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from('crew')
      .update({ name, festival })
      .eq('id', crew.id);

    setLoading(false);
    if (!error) {
      onSave?.({ ...crew, name, festival });
      setSuccessMessage('Crew info updated successfully.');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } else {
      setErrorMessage('Something went wrong while saving.');
    }
  };

  return (
    <DialogContent className='sm:max-w-[425px] bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-purple-300'>
      <DialogHeader>
        <DialogTitle className='text-purple-700 text-center text-xl font-extrabold'>
          Edit Crew Info
        </DialogTitle>
      </DialogHeader>
      <div className='space-y-4 mt-2'>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Crew Name'
          className='border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 p-3 w-full rounded'
        />
        <input
          value={festival}
          onChange={(e) => setFestival(e.target.value)}
          placeholder='Festival Name'
          className='border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 p-3 w-full rounded'
        />
        <Button
          onClick={handleSave}
          disabled={loading}
          className='w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90'
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
      {errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}
      {successMessage && (
        <p className='text-green-600 text-sm'>{successMessage}</p>
      )}
    </DialogContent>
  );
}
