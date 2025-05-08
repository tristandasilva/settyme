// app/crew/[id]/polls/page.tsx

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // at top
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import Loader from '@/components/Loader';

type Poll = {
  id: string;
  title: string | null;
  artist_1_name: string;
  artist_1_time: string;
  artist_1_stage: string;
  artist_2_name: string;
  artist_2_time: string;
  artist_2_stage: string;
};

export default function CrewPollsPage() {
  const supabase = createClient();
  const router = useRouter();
  const { id: crewId } = useParams();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    const fetchPolls = async () => {
      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .eq('crew_id', crewId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching polls:', error.message);
      } else {
        setPolls(data as Poll[]);
      }

      setLoading(false);
    };

    fetchPolls();
  }, [crewId]);

  return (
    <div className='max-w-4xl mx-auto px-4 py-8 space-y-8'>
      <NavBar variant='gradient' />
      <div className='flex justify-between items-center px-1.5'>
        <h1 className='text-2xl font-extrabold text-purple-700'>
          Artist Voting Polls
        </h1>
        {polls.length > 0 && (
          <Button
            onClick={() => {
              setNavigating(true);
              router.push(`/crew/${crewId}/polls/new`);
            }}
            disabled={navigating}
            className='bg-gradient-to-r from-purple-600 to-pink-500 text-white flex items-center gap-2'
          >
            {navigating ? (
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
            ) : (
              'Create New Poll'
            )}
          </Button>
        )}
      </div>
      {loading ? (
        <div className='flex justify-center items-center h-96'>
          <Loader />
        </div>
      ) : polls.length === 0 ? (
        <div className='text-center border border-dashed border-purple-300 bg-white/90 p-6 rounded-xl shadow-sm'>
          <p className='text-lg font-semibold text-purple-700 mb-1'>
            No polls yet 🗳️
          </p>
          <p className='text-sm text-gray-600 mb-4'>
            Looks like your crew hasn&apos;t voted on any set conflicts yet.
          </p>
          <Button
            onClick={() => {
              setNavigating(true);
              router.push(`/crew/${crewId}/polls/new`);
            }}
            disabled={navigating}
            className='bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition'
          >
            {navigating ? (
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
            ) : (
              'Create the First Poll'
            )}
          </Button>
        </div>
      ) : (
        <ul className='space-y-4'>
          {polls.map((poll) => (
            <Link
              key={poll.id}
              href={`/crew/${crewId}/polls/${poll.id}`}
              className='block border border-purple-200 rounded-lg px-4 py-7 hover:bg-purple-50 transition'
            >
              <h2 className='font-bold text-purple-700 mb-2'>
                {poll.title || 'Set Conflict'}
              </h2>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <p className='font-medium'>{poll.artist_1_name}</p>
                  <p className='text-gray-600'>
                    {poll.artist_1_time} — {poll.artist_1_stage}
                  </p>
                </div>
                <div>
                  <p className='font-medium'>{poll.artist_2_name}</p>
                  <p className='text-gray-600'>
                    {poll.artist_2_time} — {poll.artist_2_stage}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}
