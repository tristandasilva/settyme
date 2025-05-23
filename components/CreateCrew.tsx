'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';

export default function CreateCrew() {
  const [name, setName] = useState('');
  const [festival, setFestival] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const generateJoinCode = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleCreate = async () => {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const joinCode = generateJoinCode();
    const { data, error } = await supabase
      .from('crew')
      .insert([{ name, festival, created_by: user.id, join_code: joinCode }])
      .select()
      .single();

    if (data && !error) {
      await supabase
        .from('crew_member')
        .insert([{ user_id: user.id, crew_id: data.id }]);
      router.push(`/crew/${data.id}`);
    } else {
      alert(error?.message);
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:opacity-90 transition'>
          <PlusCircle size={18} /> Create Crew
        </Button>
      </DialogTrigger>
      <DialogContent className='space-y-4'>
        <DialogTitle className='text-2xl font-bold text-purple-700 text-center'>
          Create a New Crew
        </DialogTitle>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Crew Name'
          className='w-full border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 p-3 rounded'
        />
        <input
          value={festival}
          onChange={(e) => setFestival(e.target.value)}
          placeholder='Festival Name'
          className='w-full border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 p-3 rounded'
        />

        <button
          onClick={handleCreate}
          disabled={loading}
          className='w-full flex justify-center items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {loading ? (
            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
          ) : (
            'Create Crew'
          )}
        </button>
      </DialogContent>
    </Dialog>
  );
}
