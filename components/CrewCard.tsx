'use client';
import { useRouter } from 'next/navigation';

type CrewCardProps = {
  id: string;
  name: string;
  festival: string;
};

export default function CrewCard({ id, name, festival }: CrewCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/crew/${id}`)}
      className='p-4 border rounded hover:bg-purple-50 cursor-pointer transition-colors'
    >
      <p className='font-bold'>{name}</p>
      <p className='text-sm text-gray-600'>Festival: {festival}</p>
    </div>
  );
}
