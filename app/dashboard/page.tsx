'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

import CrewCard from '@/components/CrewCard';
import CreateCrew from '@/components/CreateCrew';
import JoinCrew from '@/components/JoinCrew';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

type Crew = {
  id: string;
  name: string;
  festival: string;
};

type CrewMemberRow = {
  crew: Crew;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [crews, setCrews] = useState<Crew[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return router.push('/login');
      setUser(user);

      const { data, error } = await supabase
        .from('crew_member')
        .select('crew(id, name, festival)')
        .eq('user_id', user.id);

      if (data) {
        const mapped: Crew[] = (data as unknown as CrewMemberRow[]).map(
          (item) => ({
            id: item.crew.id,
            name: item.crew.name,
            festival: item.crew.festival,
          })
        );
        setCrews(mapped);
      } else {
        console.error('Error fetching crews:', error?.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='max-w-3xl mx-auto px-4 py-8 space-y-10'>
      {/* Gradient header */}
      <header className='flex justify-between items-center px-5 py-4 rounded-lg shadow-md bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600'>
        <h1 className='text-xl font-bold text-white tracking-wide'>SetTyme</h1>
        <Button
          variant='ghost'
          className='text-white hover:bg-white/10 transition-colors'
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            router.push('/login');
          }}
        >
          <LogOut size={18} className='mr-2' />
          Log Out
        </Button>
      </header>

      {/* Welcome text */}
      <div className='text-center'>
        <h2 className='text-3xl font-extrabold text-purple-700 mb-2'>
          Welcome, {user?.email}
        </h2>
        <p className='text-gray-600'>Let&apos;s get your crew festival-ready</p>
      </div>

      {/* Crew Section */}
      <section>
        <h3 className='text-xl font-semibold text-gray-800 mb-4'>Your Crews</h3>

        {crews.length === 0 ? (
          <div className='bg-white border border-dashed border-purple-300 p-6 rounded-xl text-center shadow-sm'>
            <p className='text-lg font-medium text-gray-700 mb-2'>
              You’re not part of any crews yet!
            </p>
            <p className='text-sm text-gray-500 mb-4'>
              You can create a new one or join an existing crew to get started.
            </p>
          </div>
        ) : (
          <ul className='space-y-4'>
            {crews.map((crew) => (
              <CrewCard key={crew.id} {...crew} />
            ))}
          </ul>
        )}
      </section>

      {/* Crew Actions */}
      <section className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <CreateCrew />
        <JoinCrew />
      </section>
    </div>
  );
}
