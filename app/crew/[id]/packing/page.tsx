'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className='max-w-2xl mx-auto px-4 py-10 space-y-8'>
      {/* Gradient Header */}
      <header className='rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 px-6 py-4 shadow-md text-white text-center'>
        <h1 className='text-3xl font-extrabold'>Packing List</h1>
        <p className='text-sm text-white/80 mt-1'>Check it off as you go ✨</p>
      </header>

      {/* Input */}
      <div className='flex gap-2'>
        <input
          type='text'
          placeholder='Add an item...'
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className='flex-1 p-3 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500'
        />
        <Button
          onClick={addItem}
          className='h-[48px] bg-purple-600 hover:bg-purple-700 text-white gap-2'
        >
          <Plus size={16} />
          Add
        </Button>
      </div>

      {/* Checklist */}
      <ul className='space-y-3'>
        {items.map((item) => (
          <li
            key={item.id}
            className={`flex items-center justify-between p-3 border rounded-lg shadow-sm ${
              item.checked ? 'bg-gray-100' : 'bg-white'
            }`}
          >
            <label className='flex items-center gap-3 cursor-pointer'>
              <input
                type='checkbox'
                checked={item.checked}
                onChange={() => toggleItem(item)}
                className='accent-purple-600 w-5 h-5'
              />
              <span
                className={`text-sm ${
                  item.checked ? 'line-through text-gray-500' : 'text-gray-800'
                }`}
              >
                {item.label}
              </span>
            </label>
            {item.checked && (
              <CheckCircle className='text-purple-500' size={18} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
