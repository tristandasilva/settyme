'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import PollForm from '@/components/PollForm';
import Loader from '@/components/Loader';

export default function EditPollPage() {
  const { pollId, id: crewId } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchPoll = async () => {
      const { data } = await supabase
        .from('polls')
        .select('*')
        .eq('id', pollId)
        .single();
      setPoll(data);
      setLoading(false);
    };
    fetchPoll();
  }, [pollId]);

  if (loading) return <Loader />;

  return (
    <div className='max-w-4xl mx-auto px-4 py-10 space-y-6'>
      {/* <h1 className='text-2xl font-extrabold text-purple-700 text-center'>
        Edit Poll
      </h1> */}
      {poll && <PollForm crewId={crewId as string} poll={poll} />}
    </div>
  );
}
