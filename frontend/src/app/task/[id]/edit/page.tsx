"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";

import { AppDispatch, RootState } from "@/redux/store";
import { fetchTasks } from "@/redux/utils/fetchTask";

export default function EditTaskForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const taskId = params?.id as string | undefined;

  const taskFromStore = useSelector((state: RootState) =>
    state.tasks.find((task) => task.id === taskId)
  );

  const [formData, setFormData] = useState({
    id: "",
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

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (taskFromStore) {
      setFormData({
        ...formData,
        ...taskFromStore,
        context: taskFromStore.context ?? "",
        createdAt: taskFromStore.createdAt ?? formData.createdAt,
        updatedAt: new Date().toISOString(),
      });
    }
  }, [taskFromStore]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSubmit = async () => {
    // basic validation
    if (!formData.title || !formData.description) {
      setToast({ message: "Title and Description are required.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/change", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
          Accept: "Application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setToast({ message: "Task updated successfully!", type: "success" });
        dispatch(fetchTasks());
        setTimeout(() => router.push("/"), 1000); // navigate after a delay
      } else {
        const error = await response.text();
        setToast({ message: error || "Failed to update task", type: "error" });
      }
    } catch (err) {
        console.log(err)
      setToast({ message: "Server error. Try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 mt-10 border rounded-xl shadow-md bg-white dark:bg-gray-900 space-y-6 text-gray-800 dark:text-gray-100">
      <h2 className="text-2xl font-semibold">Edit Task</h2>

      {toast && (
        <div
          className={`text-sm px-4 py-2 rounded ${
            toast.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-1">
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full border dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 rounded"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">Priority (1–5)</label>
        <input
          type="number"
          name="priority"
          min="1"
          max="5"
          value={formData.priority}
          onChange={handleChange}
          className="w-full border dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 rounded"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">Deadline</label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full border dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 rounded"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 rounded"
        >
          <option value="">Select status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className={`${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } text-white px-5 py-2 rounded transition-all`}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>Created At: {formData.createdAt}</p>
        <p>Last Updated: {formData.updatedAt}</p>
      </div>
    </div>
  );
}
