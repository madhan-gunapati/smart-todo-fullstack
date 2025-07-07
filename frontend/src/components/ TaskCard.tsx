'use client';

import { useRouter } from "next/navigation";

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  deadline: string;
  priority: number;
  status: string;
}

export default function TaskCard({ task }: { task: Task }) {
  const router = useRouter();

  const priorityColor =
    task.priority <= 3 ? "text-green-600" : "text-red-600";

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md space-y-3 border dark:border-gray-700 transition-colors duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {task.title}
        </h3>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        {task.description}
      </p>

      <p className={`text-sm font-bold ${priorityColor}`}>
        Priority: {task.priority}
      </p>

      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Deadline: {task.deadline}</span>
        <span>Category: {task.category}</span>
      </div>

      <button
        type="button"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition"
        onClick={() => router.push(`/task/${task.id}/edit`)}
      >
        Edit
      </button>
    </div>
  );
}
