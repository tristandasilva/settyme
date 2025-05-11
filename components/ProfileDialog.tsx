'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { createClient } from '@/lib/supabase/client';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
};

export default function ProfileDialog({ open, onClose, onSave }: Props) {
  const supabase = createClient();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setErrorMessage('');
      setSuccessMessage('');
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return onClose();
      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      setFirstName(data?.first_name || '');
      setLastName(data?.last_name || '');
    };

    if (open) fetchProfile();
  }, [open]);

  const handleSave = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return onClose();
    const { error } = await supabase
      .from('profiles')
      .update({ first_name: firstName, last_name: lastName })
      .eq('id', user.id);

    setLoading(false);

    if (error) {
      setErrorMessage('Something went wrong while saving.');
      console.error(error);
    } else {
      setSuccessMessage('Profile updated!');
      onSave?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px] bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-purple-300'>
        <DialogHeader>
          <DialogTitle className='text-purple-700 text-center text-xl font-extrabold'>
            Edit Your Profile
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4 mt-2'>
          <input
            type='text'
            placeholder='First Name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className='border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 p-3 w-full rounded'
          />
          <input
            type='text'
            placeholder='Last Name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className='border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 p-3 w-full rounded'
          />
          <Button
            onClick={handleSave}
            disabled={loading}
            className='bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold px-4 py-2 rounded w-full hover:opacity-90 transition'
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
        {errorMessage && <p className='text-red-500 text=sm'>{errorMessage}</p>}
        {successMessage && (
          <p className='text-green-600 text-sm'>{successMessage}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
