'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

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

  // Get logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  // Fetch all rideshare entries for the crew
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

    // Upsert (insert or update) user's entry
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
    <div className='max-w-lg mx-auto mt-10 px-4'>
      <h1 className='text-2xl font-bold mb-6'>Rideshare Planner</h1>

      <div className='space-y-3 mb-8'>
        <label className='block'>
          <span className='text-sm font-medium'>
            Are you a driver or passenger?
          </span>
          <select
            className='w-full border p-2 rounded'
            value={form.is_driver ? 'driver' : 'passenger'}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                is_driver: e.target.value === 'driver',
              }))
            }
          >
            <option value='driver'>Driver</option>
            <option value='passenger'>Passenger</option>
          </select>
        </label>

        <label className='block'>
          <span className='text-sm font-medium'>
            {form.is_driver ? 'Seats Available' : 'Seats Needed'}
          </span>
          <input
            type='number'
            className='w-full border p-2 rounded'
            value={form.seats}
            onChange={(e) =>
              setForm((f) => ({ ...f, seats: Number(e.target.value) }))
            }
          />
        </label>

        <label className='block'>
          <span className='text-sm font-medium'>Note</span>
          <textarea
            className='w-full border p-2 rounded'
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            placeholder='e.g. Leaving Friday at 3pm'
          />
        </label>

        <button
          onClick={handleSubmit}
          className='bg-purple-600 text-white px-4 py-2 rounded w-full'
        >
          Save Rideshare Info
        </button>
      </div>

      <h2 className='text-lg font-semibold mb-2'>Crew Rideshares</h2>
      <ul className='space-y-2'>
        {entries.map((entry) => (
          <li
            key={entry.id}
            className='border p-3 rounded bg-white text-sm flex flex-col'
          >
            <span>
              {entry.is_driver ? '🚗 Driver' : '🧍 Passenger'} – {entry.seats}{' '}
              {entry.is_driver ? 'seat(s) available' : 'seat(s) needed'}
            </span>
            {entry.note && (
              <span className='text-gray-500 mt-1'>{entry.note}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
