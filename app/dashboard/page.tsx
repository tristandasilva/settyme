'use client'; // This directive tells Next.js to render this component on the client side

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import CreateCrew from './CreateCrew';
import CrewCard from '@/components/CrewCard';
import { createClient } from '@/lib/supabase/client';

// Type definition for a single crew
type Crew = {
  id: string;
  name: string;
  festival: string;
};

// Type definition for a row returned from the 'crew_member' table
// Each row includes a related 'crew' object
type CrewMemberRow = {
  crew: Crew;
};

export default function DashboardPage() {
  const router = useRouter();

  // Store the logged-in user
  const [user, setUser] = useState<User | null>(null);

  // Store the list of crews the user is part of
  const [crews, setCrews] = useState<Crew[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Attempt to get the current authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Redirect to login page if no user is found
      if (!user) {
        return router.push('/login');
      } else {
        // Otherwise, set the user in state
        setUser(user);
      }

      // Fetch all crews that the user belongs to (via the 'crew_member' join table)
      const { data, error } = await supabase
        .from('crew_member')
        .select('crew(id, name, festival)') // Select specific fields from the related 'crew' table
        .eq('user_id', user.id); // Filter by current user's ID

      if (data) {
        // console.log(data); // Optional debug: see raw data from Supabase

        // Transform the data into an array of Crew objects
        const mapped: Crew[] = (data as unknown as CrewMemberRow[]).map(
          (item) => ({
            id: item.crew.id,
            name: item.crew.name,
            festival: item.crew.festival,
          })
        );

        // console.log(mapped); // Optional debug: see final mapped data
        setCrews(mapped); // Save to state
      } else {
        console.error('Error fetching crews:', error?.message); // Log any fetch errors
      }
    };

    fetchData(); // Run the data-fetching logic when the component mounts
  }, []);

  return (
    <div className='max-w-lg mx-auto mt-10'>
      {/* Welcome header with user email */}
      <h1 className='text-2xl font-bold mb-4'>Welcome, {user?.email}</h1>

      {/* Crew list section */}
      <h2 className='text-lg font-semibold mb-2'>Your Crews</h2>
      <ul className='space-y-3'>
        {/* Render a CrewCard for each crew */}
        {crews.map((crew) => (
          <CrewCard
            key={crew.id}
            id={crew.id}
            name={crew.name}
            festival={crew.festival}
          />
        ))}
      </ul>

      {/* Button/component to create a new crew */}
      <CreateCrew />
    </div>
  );
}
