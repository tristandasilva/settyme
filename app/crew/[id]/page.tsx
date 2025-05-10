'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Users, PackageCheck, Car, DoorOpen, Vote } from 'lucide-react';
import NavBar from '@/components/NavBar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Loader from '@/components/Loader';

type Crew = {
  id: string;
  name: string;
  festival: string;
  join_code: string;
};

type CrewMember = {
  id?: string;
  first_name?: string;
  last_name?: string;
};

export default function CrewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [crew, setCrew] = useState<Crew | null>(null);
  const [members, setMembers] = useState<CrewMember[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchCrew = async () => {
      const supabase = createClient();

      // Fetch crew details
      const { data, error } = await supabase
        .from('crew')
        .select('id, name, festival, join_code')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Crew not found');
        return router.push('/dashboard');
      }
      setCrew(data);

      // Fetch crew members
      const { data: memberData, error: memberError } = await supabase
        .from('crew')
        .select('profiles(id, first_name, last_name)')
        .eq('id', id);

      if (!memberError && memberData[0].profiles) {
        setMembers(memberData[0].profiles);
        console.log(members);
      } else {
        console.error('Error fetching members:', memberError);
      }
    };

    fetchCrew();
  }, [id, router]);

  if (!crew)
    return (
      <div className='h-screen flex items-center justify-center'>
        <Loader />
      </div>
    );

  return (
    <div className='max-w-5xl mx-auto px-4 py-7 space-y-8'>
      <NavBar variant='default' />
      {/* Gradient Header */}
      <header className='rounded-xl bg-gradient-to-r from-purple-700 via-pink-500 to-indigo-600 px-6 py-5 shadow-md text-center text-white'>
        <h1 className='text-3xl font-extrabold'>{crew.name}</h1>
        <p className='text-sm text-white/80 mt-1'>Festival: {crew.festival}</p>
      </header>
      <div>
        <h2 className='px-1 text-lg font-semibold text-gray-700 mt-6 mb-2'>
          Crew Tools
        </h2>
        {/* Tool Buttons */}
        <section className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <a href={`/crew/${id}/packing`}>
            <Card className='flex flex-col gap-3 border-l-4 border-purple-600 bg-white hover:shadow-md hover:scale-[1.02] hover:bg-purple-50 transition'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-purple-700'>
                  <PackageCheck size={20} />
                  Packing List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-purple-700/90'>
                  Organize your must-haves so no one forgets their glitter.
                </p>
              </CardContent>
            </Card>
          </a>

          <a href={`/crew/${id}/rideshare`}>
            <Card className='flex flex-col gap-3 border-l-4 border-purple-600 bg-white hover:shadow-md hover:scale-[1.02] hover:bg-purple-50 transition'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-purple-700'>
                  <Car size={20} />
                  Rideshare
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-purple-700/90'>
                  Coordinate who’s riding with who and bumpin’ the aux.
                </p>
              </CardContent>
            </Card>
          </a>

          <a href={`/crew/${id}/polls`}>
            <Card className='flex flex-col gap-3 border-l-4 border-purple-600 bg-white hover:shadow-md hover:scale-[1.02] hover:bg-purple-50 transition'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-purple-700'>
                  <Vote size={20} /> Artist Polls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-purple-700/90'>
                  Let your crew vote on which set to rage at when sets clash.
                </p>
              </CardContent>
            </Card>
          </a>
        </section>
      </div>

      <div className='h-5 bg-gradient-to-b from-transparent via-purple-50 to-white rounded-xl' />
      {/* Crew Members */}
      <div>
        <h2 className='flex items-center gap-2 text-lg font-semibold text-gray-700 mb-2 border-gray-200'>
          Crew Members
        </h2>
        <section className='bg-white/90 border border-purple-200 rounded-xl p-6 shadow-sm space-y-4'>
          {/* <h3 className='text-lg font-semibold text-purple-700 flex items-center gap-2'>
          <Users size={20} />
          Crew Members
        </h3> */}

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
                  {member.first_name + ' ' + member.last_name}
                </li>
              ))}
            </ul>
          )}
          {/* Share Join Code */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant='outline'
                className='w-full rounded-lg text-purple-900 bg-purple-50 px-6 py-5 border border-purple-200 shadow-sm text-center'
              >
                🔗 Show Join Code
              </Button>
            </DialogTrigger>
            <DialogContent className='space-y-1'>
              <DialogTitle className='text-xl font-bold text-purple-700 text-center'>
                Invite Someone to Join
              </DialogTitle>
              <p className='text-sm text-gray-600 text-center'>
                Share this code with friends to join your crew:
              </p>
              <div className='w-full p-3 border border-purple-300 rounded-lg text-center text-lg font-mono bg-purple-50'>
                {crew.join_code}
              </div>
              <Button
                className={`w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white transition relative ${
                  successMessage ? 'bg-green-500' : ''
                }`}
                onClick={() => {
                  navigator.clipboard.writeText(crew.join_code);
                  setSuccessMessage('copied');
                  // Reset after 2 seconds
                  setTimeout(() => setSuccessMessage(''), 2000);
                }}
              >
                {successMessage ? (
                  <span className='flex items-center justify-center gap-2'>
                    Copied!
                  </span>
                ) : (
                  'Copy Code'
                )}
              </Button>
            </DialogContent>
          </Dialog>
          <div className='pt-4 border-t border-purple-100 mt-4' />
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant='outline'
                  className='w-full justify-center text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 transition'
                >
                  <DoorOpen size={16} className='mr-2' />
                  Leave This Crew
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <div className='space-y-1 text-center'>
                  <DialogTitle className='text-lg font-bold text-red-600'>
                    Are you sure?
                  </DialogTitle>
                  <DialogDescription className='text-gray-600'>
                    You’ll be removed from the crew and sent back to your
                    dashboard.
                  </DialogDescription>
                </div>
                <Button
                  variant='destructive'
                  className='w-full P-0'
                  onClick={async () => {
                    setErrorMessage('');
                    const supabase = createClient();
                    const {
                      data: { user },
                    } = await supabase.auth.getUser();

                    if (!user) return router.push('/login');

                    const { error } = await supabase
                      .from('crew_member')
                      .delete()
                      .eq('crew_id', id)
                      .eq('user_id', user.id);

                    if (!error) {
                      router.push('/dashboard');
                    } else {
                      console.error('Failed to leave crew:', error.message);
                      setErrorMessage('Something went wrong.');
                    }
                  }}
                >
                  Yes, Leave Crew
                </Button>
                {errorMessage && (
                  <div className='text-red-700 rounded text-sm'>
                    {errorMessage}
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </section>
      </div>
      {/* Leave Crew Button */}
      <div className='pt-0 border-t border-gray-200'></div>
    </div>
  );
}
