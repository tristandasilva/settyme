'use client';

export default function Loader() {
  return (
    <div className='flex flex-col items-center justify-center py-10 text-purple-600 animate-pulse'>
      <div className='w-12 h-12 rounded-full border-4 border-purple-400 border-t-transparent animate-spin mb-4'></div>
      <p className='text-sm font-medium'>Gathering festival vibes...</p>
    </div>
  );
}
