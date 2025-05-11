import { useState } from 'react';
import { Button } from './ui/button';
import { RideshareEntry } from '@/app/types/rideshare';

type RideshareItemProps = {
  entry: RideshareEntry;
  currentUserId: string | null;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (updated: {
    id: string;
    is_driver: boolean;
    seats: number;
    note: string;
  }) => void;
  onDelete: () => void;
};

function RideshareItem({
  entry,
  currentUserId,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onDelete,
}: RideshareItemProps) {
  const [localNote, setLocalNote] = useState(entry.note);
  const [localSeats, setLocalSeats] = useState(entry.seats);
  const [localIsDriver, setLocalIsDriver] = useState(entry.is_driver);

  return (
    <li className='border p-3 rounded bg-white text-sm flex flex-col shadow-sm'>
      <span className='text-gray-700 text-sm mb-1 font-semibold'>
        {entry.user_id === currentUserId
          ? 'You'
          : entry.profiles?.first_name || 'Anonymous'}
      </span>

      {isEditing ? (
        <>
          <div className='flex flex-col gap-2'>
            <select
              value={localIsDriver ? 'driver' : 'passenger'}
              onChange={(e) => setLocalIsDriver(e.target.value === 'driver')}
              className='border rounded px-2 py-1'
            >
              <option value='driver'>Driver</option>
              <option value='passenger'>Passenger</option>
            </select>

            <input
              type='number'
              value={localSeats}
              min={1}
              className='border rounded px-2 py-1'
              onChange={(e) => setLocalSeats(Number(e.target.value))}
            />

            <textarea
              value={localNote}
              onChange={(e) => setLocalNote(e.target.value)}
              className='border rounded px-2 py-1'
              placeholder='Note'
            />
          </div>

          <div className='flex gap-2 mt-2'>
            <Button
              size='sm'
              onClick={() =>
                onSave({
                  id: entry.id,
                  is_driver: localIsDriver,
                  seats: localSeats,
                  note: localNote,
                })
              }
            >
              Save
            </Button>
            <Button size='sm' variant='ghost' onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <span className='font-medium text-purple-700'>
            {entry.is_driver ? '🚗 Driver' : '🧍 Passenger'} – {entry.seats}{' '}
            {entry.is_driver ? 'seat(s) available' : 'seat(s) needed'}
          </span>
          {entry.note && (
            <span className='text-gray-500 mt-1'>{entry.note}</span>
          )}
          {entry.user_id === currentUserId && (
            <div className='mt-3 flex gap-2'>
              <Button
                size='sm'
                variant='outline'
                className='py-1 px-2 rounded-sm text-xs'
                onClick={onEdit}
              >
                Edit
              </Button>
              <Button
                size='sm'
                variant='destructive'
                className='py-1 px-2 rounded-sm text-xs'
                onClick={onDelete}
              >
                Delete
              </Button>
            </div>
          )}
        </>
      )}
    </li>
  );
}

export default RideshareItem;
