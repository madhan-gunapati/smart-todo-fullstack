'use client';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { createTask } from '@/redux/utils/taskThunk';

export default function TaskForm() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sendtoDB = createTask({
      title,
      description,
      status: '',
      deadline: new Date().toISOString().split('T')[0],
      priority: 1,
      category: '',
    });

    sendtoDB(dispatch);
    setTitle('');
    setDescription('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow transition-colors duration-300"
    >
      <input
        className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Description"
        value={description}
        rows={4}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors w-full sm:w-auto"
        type="submit"
      >
        Add Task
      </button>
    </form>
  );
}
