'use client'; // This directive tells Next.js to render this component on the client side

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import CreateCrew from './CreateCrew';
import CrewCard from '@/components/CrewCard';

type Crew = {
  id: string;
  name: string;
  festival: string;
};

type CrewMemberRow = {
  crew_id: string;
  crews: {
    id: string;
    name: string;
    festival: string;
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [crews, setCrews] = useState<Crew[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: session } = await supabase.auth.getUser();
      if (!session.user) return router.push('/login');
      setUser(session.user);

      const { data, error } = await supabase
        .from('crew_members')
        .select('crew_id, crews(id, name, festival)')
        .eq('user_id', session.user.id);
      if (data) {
        console.log(data);
        const mapped = data.map((item: CrewMemberRow) => ({
          id: item.crews.id,
          name: item.crews.name,
          festival: item.crews.festival,
        }));
        setCrews(mapped);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='max-w-lg mx-auto mt-10'>
      <h1 className='text-2xl font-bold mb-4'>Welcome, {user?.email}</h1>

      <h2 className='text-lg font-semibold mb-2'>Your Crews</h2>
      <ul className='space-y-3'>
        {crews.map((crew) => (
          <CrewCard
            key={crew.id}
            id={crew.id}
            name={crew.name}
            festival={crew.festival}
          />
        ))}
      </ul>
      <CreateCrew />
    </div>
  );
}
