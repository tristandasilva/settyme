'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import BackToCrewButton from '@/components/BackToCrewButton';
import RideshareItem from '@/components/RideShareItem';
import { RideshareEntry } from '@/app/types/rideshare';

export default function RidesharePage() {
  const { id } = useParams(); // crew_id
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<RideshareEntry[]>([]);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
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
        .select(
          `
          id,
          user_id,
          is_driver,
          seats,
          note,
          profiles (
            first_name
          )
`
        )
        .eq('crew_id', id)
        .order('created_at', { ascending: true }); // or false for newest first

      if (!error && data) {
        const formatted = data.map((entry) => ({
          ...entry,
          profiles: Array.isArray(entry.profiles)
            ? entry.profiles[0]
            : entry.profiles,
        }));
        setEntries(formatted);
      }
    };

    fetchEntries();
  }, [id]);

  const handleSubmit = async () => {
    if (!user) return;

    const { error } = await supabase.from('rideshare').upsert({
      id: editingEntryId || undefined,
      crew_id: id,
      user_id: user.id,
      is_driver: form.is_driver,
      seats: form.seats,
      note: form.note,
    });

    if (!error) {
      const { data } = await supabase
        .from('rideshare')
        .select(
          `
          id,
          user_id,
          is_driver,
          seats,
          note,
          profiles (
            first_name
          )
`
        )
        .eq('crew_id', id)
        .order('created_at', { ascending: true }); // or false for newest first

      if (data) {
        const formatted = data.map((entry) => ({
          ...entry,
          profiles: Array.isArray(entry.profiles)
            ? entry.profiles[0]
            : entry.profiles,
        }));
        setEntries(formatted);
        setEditingEntryId(null); // reset edit mode
        setForm({ is_driver: true, seats: 1, note: '' }); // clear form
      }
    }
  };

  // const handleEdit = (entry: RideshareEntry) => {
  //   setForm({
  //     is_driver: entry.is_driver,
  //     seats: entry.seats,
  //     note: entry.note,
  //   });
  //   setEditingEntryId(entry.id);
  // };

  const handleDelete = async (entryId: string) => {
    const { error } = await supabase
      .from('rideshare')
      .delete()
      .eq('id', entryId)
      .eq('user_id', user?.id); // safety check on backend

    if (!error) {
      setEntries((prev) => prev.filter((e) => e.id !== entryId));
    }
  };

  return (
    <div className='max-w-5xl mx-auto px-4 py-10 space-y-6'>
      <NavBar variant='default' />
      <BackToCrewButton />
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
            className='w-full border border-purple-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500'
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
            className='w-full border border-purple-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500'
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
          {editingEntryId ? 'Update Entry' : 'Save Rideshare Info'}
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
              <RideshareItem
                key={entry.id}
                entry={entry}
                currentUserId={user?.id || null}
                isEditing={editingEntryId === entry.id}
                onEdit={() => setEditingEntryId(entry.id)}
                onCancel={() => setEditingEntryId(null)}
                onDelete={() => handleDelete(entry.id)}
                onSave={async (updated) => {
                  const { error } = await supabase
                    .from('rideshare')
                    .update({
                      is_driver: updated.is_driver,
                      seats: updated.seats,
                      note: updated.note,
                    })
                    .eq('id', updated.id)
                    .eq('user_id', user?.id);

                  if (!error) {
                    const { data } = await supabase
                      .from('rideshare')
                      .select(
                        `
              id,
              user_id,
              is_driver,
              seats,
              note,
              profiles (
                first_name
              )
            `
                      )
                      .eq('crew_id', id);
                    if (data) {
                      const formatted = data.map((entry) => ({
                        ...entry,
                        profiles: Array.isArray(entry.profiles)
                          ? entry.profiles[0]
                          : entry.profiles,
                      }));
                      setEntries(formatted);
                      setEditingEntryId(null);
                    }
                  }
                }}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
