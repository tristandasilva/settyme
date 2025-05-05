'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';

type RideshareEntry = {
  id: string;
  user_id: string;
  is_driver: boolean;
  seats: number;
  note: string;
};

export default function RidesharePage() {
  const { id } = useParams(); // crew_id
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<RideshareEntry[]>([]);
  const [form, setForm] = useState({
    is_driver: true,
    seats: 1,
    note: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from('rideshare')
        .select('*')
        .eq('crew_id', id);

      if (!error) setEntries(data);
    };

    fetchEntries();
  }, [id]);

  const handleSubmit = async () => {
    if (!user) return;

    const { error } = await supabase.from('rideshare').upsert({
      crew_id: id,
      user_id: user.id,
      is_driver: form.is_driver,
      seats: form.seats,
      note: form.note,
    });

    if (!error) {
      const { data } = await supabase
        .from('rideshare')
        .select('*')
        .eq('crew_id', id);
      setEntries(data || []);
    }
  };

  return (
    <div className='max-w-3xl mx-auto px-4 py-10 space-y-10'>
      {/* Gradient header */}
      <header className='rounded-xl bg-gradient-to-r from-purple-700 via-pink-500 to-indigo-600 px-6 py-4 shadow-md text-white text-center'>
        <h1 className='text-3xl font-extrabold'>Rideshare Planner</h1>
        <p className='text-sm text-white/80 mt-1'>
          Coordinate rides with your crew
        </p>
      </header>

      {/* Rideshare Form */}
      <section className='bg-white/90 border border-purple-200 rounded-xl p-6 shadow-sm space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-1 text-gray-700'>
            Are you a driver or passenger?
          </label>
          <select
            className='w-full border border-purple-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500'
            value={form.is_driver ? 'driver' : 'passenger'}
            onChange={(e) =>
              setForm((f) => ({ ...f, is_driver: e.target.value === 'driver' }))
            }
          >
            <option value='driver'>Driver</option>
            <option value='passenger'>Passenger</option>
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium mb-1 text-gray-700'>
            {form.is_driver ? 'Seats Available' : 'Seats Needed'}
          </label>
          <input
            type='number'
            min={1}
            className='w-full border border-purple-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500'
            value={form.seats}
            onChange={(e) =>
              setForm((f) => ({ ...f, seats: Number(e.target.value) }))
            }
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1 text-gray-700'>
            Note
          </label>
          <textarea
            className='w-full border border-purple-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500'
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            placeholder='e.g. Leaving Friday at 3pm'
          />
        </div>

        <Button
          onClick={handleSubmit}
          className='w-full bg-purple-600 hover:bg-purple-700 text-white'
        >
          Save Rideshare Info
        </Button>
      </section>

      {/* Entries List */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold text-gray-800'>Crew Rideshares</h2>
        {entries.length === 0 ? (
          <p className='text-sm text-gray-500'>
            No one has added their rideshare info yet.
          </p>
        ) : (
          <ul className='space-y-2'>
            {entries.map((entry) => (
              <li
                key={entry.id}
                className='border p-3 rounded bg-white text-sm flex flex-col shadow-sm'
              >
                <span className='font-medium text-purple-700'>
                  {entry.is_driver ? '🚗 Driver' : '🧍 Passenger'} –{' '}
                  {entry.seats}{' '}
                  {entry.is_driver ? 'seat(s) available' : 'seat(s) needed'}
                </span>
                {entry.note && (
                  <span className='text-gray-500 mt-1'>{entry.note}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
