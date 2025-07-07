'use client'

import ContextForm from '@/components/ ContextForm';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { useEffect } from 'react';
import { fetchContexts } from '@/redux/utils/fetchContexts';

export default function ContextPage() {
  const entries = useSelector((state: RootState) => state.context.entries);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchContexts());
  }, []);

  return (
    <main className="min-h-screen px-4 py-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        <ContextForm />

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Context History
          </h2>

          <ul className="space-y-3">
            {entries.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No context added yet.</p>
            ) : (
              entries.map((entry) => (
                <li key={entry.id} className="border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                  <p className="text-sm text-gray-700 dark:text-gray-200">{entry.content}</p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Source: {entry.source} | {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
