'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 dark:bg-gray-900 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold">Smart Todo</h1>
        <div className="space-x-4 text-sm sm:text-base">
          <Link
            href="/"
            className="hover:underline hover:text-blue-300 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/task/new"
            className="hover:underline hover:text-blue-300 transition-colors"
          >
            Add Task
          </Link>
          <Link
            href="/context"
            className="hover:underline hover:text-blue-300 transition-colors"
          >
            Context
          </Link>
        </div>
      </div>
    </nav>
  );
}
