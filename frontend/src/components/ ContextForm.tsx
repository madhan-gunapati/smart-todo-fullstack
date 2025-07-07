'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addContextEntryAsync } from '@/redux/slices/contextSlice';
// import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '@/redux/store';

export default function ContextForm() {
  const [content, setContent] = useState('');
  const [source, setSource] = useState<'notes' | 'email' | 'whatsapp'>('notes');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newContext = {
      id: Date.now(), // Use a numeric id
      content,
      source,
      timestamp: new Date().toISOString(),
    };

    setLoading(true); // Start loading

    try {
      await dispatch(addContextEntryAsync(newContext)).unwrap();
      setContent('');
      setSource('notes');
    } catch (err) {
      console.error('Failed to add context:', err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border dark:border-gray-700 transition-colors"
    >
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Add Daily Context</h2>

      <textarea
        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        rows={4}
        placeholder="Paste a message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        disabled={loading}
      />

      <div className="flex flex-wrap gap-4 items-center">
        <label className="font-medium text-gray-700 dark:text-gray-300">Source:</label>
        <select
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-md px-3 py-2"
          value={source}
          onChange={(e) => setSource(e.target.value as 'notes' | 'email' | 'whatsapp')}
          disabled={loading}
        >
          <option value="notes">Notes</option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded-md transition text-white ${
          loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Adding...' : 'Add Context'}
      </button>
    </form>
  );
}
