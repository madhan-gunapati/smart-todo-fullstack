"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { createTask } from "@/redux/utils/taskThunk";

export default function NewDetailsForm() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [loadingAI, setLoadingAI] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: 0,
    deadline: "",
    status: "",
    context: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "priority" ? parseInt(value) || 0 : value,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleAISuggestions = async () => {
    if (!formData.context) {
      alert("Please provide context for AI suggestions.");
      return;
    }

    setLoadingAI(true);
    try {
      const response = await fetch("http://localhost:8000/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ context: formData.context, task: { ...formData, context: null } }),
      });

      const json = await response.json();
      setFormData((prev) => ({ ...prev, ...json.msg }));
      alert("AI title and deadline suggestions added.");
    } catch (err) {
      console.error(err);
      alert("AI suggestion request failed.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.status) {
      alert("Please fill all required fields: Title, Description, Status.");
      return;
    }

    const sendToDB = createTask(formData);
    sendToDB(dispatch);

    setFormData({
      title: "",
      description: "",
      category: "",
      priority: 0,
      deadline: "",
      status: "",
      context: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    router.push("/");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 border rounded-lg shadow-md bg-white dark:bg-gray-900 dark:border-gray-700 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Enter Task Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter task title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <input
            type="text"
            name="category"
            placeholder="e.g., Work, Personal"
            value={formData.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority (1-5)</label>
          <input
            type="number"
            name="priority"
            min={1}
            max={5}
            value={formData.priority}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            name="description"
            placeholder="Brief description of the task"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Context & Task Description (for AI)
          </label>
          <textarea
            name="context"
            placeholder="e.g., I'm planning a trip and need help breaking it into tasks..."
            value={formData.context}
            onChange={handleChange}
            rows={2}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        <button
          type="button"
          onClick={handleAISuggestions}
          disabled={loadingAI}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loadingAI ? "Loading..." : "AI Suggestions"}
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 mt-4">
        <p>Created At: {formData.createdAt}</p>
        <p>Last Updated: {formData.updatedAt}</p>
      </div>
    </div>
  );
}
