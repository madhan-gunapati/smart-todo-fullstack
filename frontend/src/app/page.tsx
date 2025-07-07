'use client';
import TaskForm from '@/components/TaskForm';
import TaskCard from '@/components/ TaskCard';
import { fetchTasks } from '@/redux/utils/fetchTask';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const tasks = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch<AppDispatch>();

  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Extract unique categories from tasks
  const uniqueCategories = Array.from(new Set(tasks.map((task) => task.category)));

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = statusFilter === 'all' || task.status === statusFilter;
    const categoryMatch = categoryFilter === 'all' || task.category === categoryFilter;
    const priorityMatch =
      priorityFilter === 'all' || task.priority === Number(priorityFilter);
    return statusMatch && categoryMatch && priorityMatch;
  });

  const downloadCSV = () => {
  if (!tasks.length) return;

  const headers = ['Title', 'Status', 'Category', 'Priority'];
  const rows = tasks.map((task) => [
    task.title,
    task.status,
    task.category,
    task.priority,
  ]);

  const csvContent =
    [headers, ...rows]
      .map((row) =>
        row
          .map((field) =>
            typeof field === 'string' && field.includes(',')
              ? `"${field}"`
              : field
          )
          .join(',')
      )
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'tasks.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Task Form */}
        <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-md transition-colors">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Add New Task
          </h2>
          <TaskForm />
        </section>

        {/* Filters */}
        <section className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Your Tasks
            </h2>
        <button
  onClick={downloadCSV}
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
>
  Download CSV
</button>

            <div className="flex flex-wrap gap-3">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-md border bg-white dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in progress">In Progress</option>
                <option value="done">Done</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-md border bg-white dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 rounded-md border bg-white dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Priorities</option>
                {[1, 2, 3, 4, 5].map((p) => (
                  <option key={p} value={p}>
                    Priority {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Task List */}
          {filteredTasks.length ? (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task, index) => (
                <TaskCard key={index} task={task} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No tasks match the selected filters.</p>
          )}
        </section>
      </div>
    </main>
  );
}
