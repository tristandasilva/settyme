'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // at top
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
  crew_id: string;
};

export default function PollVotingPage() {
  const { pollId } = useParams();
  const supabase = createClient();
  const router = useRouter();

  const [poll, setPoll] = useState<Poll | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [votes, setVotes] = useState({ artist1: 0, artist2: 0 });
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: pollData } = await supabase
        .from('polls')
        .select('*')
        .eq('id', pollId)
        .single();

      if (pollData) {
        setPoll(pollData);
        setIsCreator(user.id === pollData.creator_id);
      } else {
        router.push('/404');
      }

      const { data: voteData } = await supabase
        .from('votes')
        .select('vote')
        .eq('poll_id', pollId)
        .eq('user_id', user.id)
        .single();

      if (voteData) {
        setUserVote(voteData.vote);
      }

      const { data: allVotes } = await supabase
        .from('votes')
        .select('vote')
        .eq('poll_id', pollId);

      const counts = { artist1: 0, artist2: 0 };
      allVotes?.forEach((v) => {
        if (v.vote === 1) counts.artist1++;
        if (v.vote === 2) counts.artist2++;
      });

      setVotes(counts);
      setLoading(false);
    };

    fetchData();
  }, [pollId]);

  const handleVote = async (choice: number) => {
    if (!userId) return;

    if (userVote) {
      // Change existing vote
      await supabase
        .from('votes')
        .update({ vote: choice })
        .eq('poll_id', pollId)
        .eq('user_id', userId);
    } else {
      // First-time vote
      await supabase.from('votes').insert({
        poll_id: pollId,
        user_id: userId,
        vote: choice,
      });
    }

    setUserVote(choice);

    // Re-fetch updated votes
    const { data: allVotes } = await supabase
      .from('votes')
      .select('vote')
      .eq('poll_id', pollId);

    const updated = { artist1: 0, artist2: 0 };
    allVotes?.forEach((v) => {
      if (v.vote === 1) updated.artist1++;
      if (v.vote === 2) updated.artist2++;
    });

    setVotes(updated);
  };

  if (loading || !poll) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='max-w-5xl mx-auto px-4 py-10 space-y-6'>
      <NavBar variant='gradient' />
      <h1 className='text-2xl font-extrabold text-purple-700 text-center mb-6'>
        {poll.title || 'Set Conflict Poll'}
      </h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 text-center'>
        {[1, 2].map((num) => {
          const isChosen = userVote === num;
          const name = poll[`artist_${num}_name` as keyof Poll];
          const time = poll[`artist_${num}_time` as keyof Poll];
          const stage = poll[`artist_${num}_stage` as keyof Poll];
          const voteCount = num === 1 ? votes.artist1 : votes.artist2;

          return (
            <div
              key={num}
              className={`border rounded-2xl p-4 space-y-2 transition ${
                isChosen
                  ? 'border-purple-600 bg-purple-50 shadow-md'
                  : 'border-purple-200 hover:bg-purple-50'
              }`}
            >
              <h2 className='text-lg font-bold text-purple-700'>{name}</h2>
              <p className='text-gray-600'>{time}</p>
              <p className='text-gray-500 text-sm'>{stage}</p>

              {userVote && (
                <p className='text-sm text-gray-700 font-medium mt-2'>
                  Votes: {voteCount}
                </p>
              )}

              <Button
                variant={isChosen ? 'default' : 'outline'}
                className='mt-2'
                onClick={() => handleVote(num)}
              >
                {isChosen ? 'Voted ✅' : `Vote for ${name}`}
              </Button>
            </div>
          );
        })}
      </div>

      {userVote && (
        <p className='text-center text-sm text-gray-600 mt-4'>
          You voted for{' '}
          <strong>
            {userVote === 1 ? poll.artist_1_name : poll.artist_2_name}
          </strong>
          . You can change your vote at any time.
        </p>
      )}
      {isCreator && (
        <div className='flex justify-center gap-4 mt-6'>
          <Button
            variant='outline'
            onClick={() => {
              router.push(`/crew/${poll.crew_id}/polls/${poll.id}/edit`);
            }}
          >
            ✏️ Edit Poll
          </Button>
          <Button
            variant='outline'
            onClick={async () => {
              const confirmed = confirm(
                'Are you sure you want to delete this poll?'
              );
              if (!confirmed) return;

              const { error } = await supabase
                .from('polls')
                .delete()
                .eq('id', poll.id);

              if (error) {
                alert('Something went wrong while deleting.');
                console.error(error);
              } else {
                router.push(`/crew/${poll.crew_id}/polls`);
              }
            }}
          >
            🗑️ Delete Poll
          </Button>
        </div>
      )}
    </div>
  );
}
