'use client'; // Enables client-side rendering in Next.js

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Pencil, Trash2, CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import BackToCrewButton from '@/components/BackToCrewButton';

// Define the structure of a packing item
type PackingItem = {
  id: string;
  label: string;
  checked: boolean;
};

export default function PackingPage() {
  const { id } = useParams(); // Get crew ID from the route
  const [items, setItems] = useState<PackingItem[]>([]); // State to store packing items
  const [newItem, setNewItem] = useState(''); // State for the new item input field
  const [editingId, setEditingId] = useState<string | null>(null); // ID of the item currently being edited
  const [editedLabel, setEditedLabel] = useState(''); // Value of the edited label
  const supabase = createClient(); // Initialize Supabase client

  // Fetch packing items from the database when the component mounts or the crew ID changes
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
        setItems(data); // Store items in state
      }
    };

    fetchItems();
  }, [id, supabase]);

  // Add a new packing item
  const addItem = async () => {
    if (!newItem.trim()) return; // Avoid adding empty items

    const { data, error } = await supabase
      .from('packing_item')
      .insert([{ crew_id: id, label: newItem, checked: false }])
      .select()
      .single();

    if (error) {
      console.error('Error adding item:', error.message);
    } else {
      setItems((prev) => [...prev, data]); // Add the new item to the list
      setNewItem(''); // Clear the input
    }
  };

  // Toggle the "checked" state of an item
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

  // Delete a packing item
  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('packing_item').delete().eq('id', id);

    if (!error) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Begin editing a packing item
  const startEditing = (item: PackingItem) => {
    setEditingId(item.id);
    setEditedLabel(item.label);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditedLabel('');
  };

  // Save the edited item label
  const saveEdit = async (item: PackingItem) => {
    const trimmed = editedLabel.trim();
    if (!trimmed) return;

    const { error } = await supabase
      .from('packing_item')
      .update({ label: trimmed })
      .eq('id', item.id);

    if (!error) {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, label: trimmed } : i))
      );
      cancelEditing();
    }
  };

  return (
    <div className='max-w-5xl mx-auto px-4 py-10 space-y-6'>
      <NavBar variant='default' />
      <BackToCrewButton />
      {/* Page Header */}
      <header className='rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 px-6 py-4 shadow-md text-white text-center'>
        <h1 className='text-3xl font-extrabold'>Packing List</h1>
        <p className='text-sm text-white/80 mt-1'>Check it off as you go.</p>
      </header>

      {/* Input to add new packing item */}
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

      {/* Empty state if there are no items */}
      {items.length === 0 && (
        <div className='text-center border border-dashed border-purple-300 bg-white/90 p-6 rounded-xl shadow-sm'>
          <p className='text-lg font-semibold text-purple-700 mb-1'>
            No packing items yet 📋
          </p>
          <p className='text-sm text-gray-600 mb-4'>
            Your crew hasn&apos;t started packing. Add some essentials so no one
            forgets the sunscreen or glitter!
          </p>
        </div>
      )}

      {/* List of packing items */}
      <ul className='space-y-3'>
        {items.map((item) => (
          <li
            key={item.id}
            className={`flex items-center justify-between p-3 border rounded-lg shadow-sm ${
              item.checked ? 'bg-gray-100' : 'bg-white'
            }`}
          >
            {/* If this item is being edited, show input and actions */}
            {editingId === item.id ? (
              <div className='flex items-center gap-2 w-full'>
                <input
                  type='text'
                  value={editedLabel}
                  onChange={(e) => setEditedLabel(e.target.value)}
                  className='flex-1 p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500'
                />
                <Button onClick={() => saveEdit(item)} size='sm'>
                  Save
                </Button>
                <Button onClick={cancelEditing} variant='ghost' size='sm'>
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                {/* Checkbox and label */}
                <label className='flex items-center gap-3 cursor-pointer flex-1'>
                  <input
                    type='checkbox'
                    checked={item.checked}
                    onChange={() => toggleItem(item)}
                    className='accent-purple-600 w-5 h-5'
                  />
                  <span
                    className={`text-sm ${
                      item.checked
                        ? 'line-through text-gray-500'
                        : 'text-gray-800'
                    }`}
                  >
                    {item.label}
                  </span>
                </label>

                {/* Action buttons (edit, delete) */}
                <div className='flex gap-2 ml-4'>
                  <button
                    onClick={() => startEditing(item)}
                    className='text-gray-500 hover:text-purple-700'
                    title='Edit'
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className='text-gray-500 hover:text-red-600'
                    title='Delete'
                  >
                    <Trash2 size={16} />
                  </button>
                  {item.checked && (
                    <CheckCircle className='text-purple-500' size={18} />
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
