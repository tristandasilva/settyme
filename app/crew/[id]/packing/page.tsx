'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type PackingItem = {
  id: string;
  label: string;
  checked: boolean;
};

export default function PackingPage() {
  const { id } = useParams(); // crew_id
  const [items, setItems] = useState<PackingItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('packing_item')
        .select('*')
        .eq('crew_id', id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading packing items:', error.message);
      } else {
        setItems(data);
      }
    };

    fetchItems();
  }, [id, supabase]);

  const addItem = async () => {
    if (!newItem.trim()) return;

    const { data, error } = await supabase
      .from('packing_item')
      .insert([{ crew_id: id, label: newItem, checked: false }])
      .select()
      .single();

    if (error) {
      console.error('Error adding item:', error.message);
    } else {
      setItems((prev) => [...prev, data]);
      setNewItem('');
    }
  };

  const toggleItem = async (item: PackingItem) => {
    const { error } = await supabase
      .from('packing_item')
      .update({ checked: !item.checked })
      .eq('id', item.id);

    if (!error) {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, checked: !i.checked } : i))
      );
    }
  };

  return (
    <div className='max-w-lg mx-auto mt-10 px-4'>
      <h1 className='text-2xl font-bold mb-6'>Packing List</h1>

      <div className='flex gap-2 mb-6'>
        <input
          type='text'
          placeholder='Add item...'
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className='flex-1 border p-2 rounded'
        />
        <button
          onClick={addItem}
          className='bg-purple-600 text-white px-4 py-2 rounded'
        >
          Add
        </button>
      </div>

      <ul className='space-y-2'>
        {items.map((item) => (
          <li
            key={item.id}
            className='flex items-center gap-2 p-2 bg-white border rounded'
          >
            <input
              type='checkbox'
              checked={item.checked}
              onChange={() => toggleItem(item)}
            />
            <span className={item.checked ? 'line-through text-gray-500' : ''}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
