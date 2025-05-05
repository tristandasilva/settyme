'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Users, PackageCheck, Car } from 'lucide-react';
import NavBar from '@/components/NavBar';

type Crew = {
  id: string;
  name: string;
  festival: string;
};

// type CrewMember = {
//   id: string;
//   user: {
//     email: string;
//     name?: string;
//   };
// };

export default function CrewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [crew, setCrew] = useState<Crew | null>(null);
  //   const [members, setMembers] = useState<CrewMember[]>([]);

  useEffect(() => {
    const fetchCrew = async () => {
      const supabase = createClient();

      // Fetch crew details
      const { data, error } = await supabase
        .from('crew')
        .select('id, name, festival')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Crew not found');
        return router.push('/dashboard');
      }

      setCrew(data);

      // Fetch crew members
      //   const { data: memberData, error: memberError } = await supabase
      //     .from('crew_member')
      //     .select('user:auth.users(id, email, user_metadata)')
      //     .eq('crew_id', id);

      //   if (!memberError && memberData) {
      //     setMembers(memberData as unknown as CrewMember[]);
      //   } else {
      //     console.error('Error fetching members:', memberError);
      //   }
    };

    fetchCrew();
  }, [id, router]);

  if (!crew) return <p className='text-center mt-20'>Loading...</p>;

  return (
    <div className='max-w-3xl mx-auto px-4 py-10 space-y-10'>
      <NavBar variant='default' />
      {/* Gradient Header */}
      <header className='rounded-xl bg-gradient-to-r from-purple-700 via-pink-500 to-indigo-600 px-6 py-4 shadow-md text-white text-center'>
        <h1 className='text-3xl font-extrabold'>{crew.name}</h1>
        <p className='text-sm text-white/80 mt-1'>Festival: {crew.festival}</p>
      </header>

      {/* Tool Buttons */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <Button
          asChild
          className='w-full justify-start gap-2 bg-purple-600 hover:bg-purple-700 text-white'
        >
          <a href={`/crew/${id}/packing`}>
            <PackageCheck size={18} /> Packing List
          </a>
        </Button>

        <Button
          asChild
          variant='outline'
          className='w-full justify-start gap-2 text-purple-700 border-purple-600 hover:bg-purple-50'
        >
          <a href={`/crew/${id}/rideshare`}>
            <Car size={18} /> Rideshare Planner
          </a>
        </Button>
      </div>

      {/* Placeholder Widget */}
      <div className='bg-white/90 border border-dashed border-purple-300 p-6 rounded-xl text-center shadow-sm'>
        <p className='text-lg font-medium text-gray-700 mb-2'>
          No tool selected yet!
        </p>
        <p className='text-sm text-gray-500'>
          Choose one above to start planning with your crew ✨
        </p>
      </div>

      {/* Crew Members */}
      {/* <section className='bg-white/90 border border-purple-200 rounded-xl p-6 shadow-sm space-y-4'>
        <h3 className='text-lg font-semibold text-purple-700'>Crew Members</h3>

        {members.length === 0 ? (
          <p className='text-gray-500 text-sm'>No members yet.</p>
        ) : (
          <ul className='space-y-2'>
            {members.map((member) => (
              <li
                key={member.id}
                className='flex items-center gap-3 bg-purple-50 px-4 py-2 rounded text-sm text-purple-800'
              >
                <Users className='w-4 h-4' />
                {member.user.name || member.user.email}
              </li>
            ))}
          </ul>
        )}
      </section> */}
    </div>
  );
}
