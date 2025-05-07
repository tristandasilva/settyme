'use client';
import { Card, CardContent } from '@/components/ui/card';
type CrewCardProps = {
  id: string;
  name: string;
  festival: string;
};

export default function CrewCard({ id, name, festival }: CrewCardProps) {
  return (
    <div>
      <Card className='bg-white hover:shadow-lg transition-shadow'>
        <CardContent>
          <h3 className='text-lg font-bold text-purple-700'>{name}</h3>
          <p className='text-sm text-gray-600'>Festival: {festival}</p>
          <a
            href={`/crew/${id}`}
            className='text-sm text-purple-500 underline mt-2 inline-block'
          >
            View Crew
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
