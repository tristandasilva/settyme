'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import PollForm from '@/components/PollForm';
import Loader from '@/components/Loader';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditPollPage() {
  const router = useRouter();
  const { pollId, id: crewId } = useParams();
  const [poll, setPoll] = useState({
    id: '',
    crew_id: '',
    title: null,
    artist_1_name: '',
    artist_1_time: '',
    artist_1_stage: '',
    artist_2_name: '',
    artist_2_time: '',
    artist_2_stage: '',
  });
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
    <div className='max-w-6xl mx-auto px-4 py-10 space-y-8'>
      <NavBar variant='gradient' />

      {poll && (
        <>
          <div className='mt-0'>
            <Button
              variant='ghost'
              className='text-purple-700 hover:underline flex items-center gap-1'
              onClick={() =>
                router.push(`/crew/${poll.crew_id}/polls/${pollId}`)
              }
            >
              <ArrowLeft size={16} />
              Back to Poll
            </Button>
          </div>
          <PollForm crewId={crewId as string} poll={poll} />
        </>
      )}
    </div>
  );
}
