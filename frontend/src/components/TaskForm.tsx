import { useState, useEffect } from "react";
import { createTask, editTask } from "../api/tasks";
import type { Task } from "../types/task";

interface TaskFormProps {
  task?: Task | null;
  projectId?: number;
  onTaskSaved?: (message: string) => void;
}

export default function TaskForm({ task, projectId, onTaskSaved }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState("feature");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);

  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setTaskType(task.task_type);
      setPriority(task.priority);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId && !isEditing) {
      console.error("No project selected for new task");
      return;
    }

    setLoading(true);

    try {
      if (isEditing && task) {
        await editTask(task.id, {
          title,
          description,
          task_type: taskType,
          priority,
        });

        onTaskSaved?.("Task updated successfully");
      } else {
        await createTask({
          title,
          description,
          task_type: taskType,
          priority,
          project: projectId!,
        });

        onTaskSaved?.("Task created successfully");
      }
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-900 p-6 rounded-2xl shadow-lg border border-zinc-800 mb-6"
    >
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? "Edit Task" : "Create Task"}
      </h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="mb-4">
        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <select
          value={taskType}
          onChange={(e) => setTaskType(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-lg p-2"
        >
          <option value="bug">Bug</option>
          <option value="feature">Feature</option>
          <option value="improvement">Improvement</option>
          <option value="refactor">Refactor</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-lg p-2"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-medium transition cursor-pointer"
      >
        {loading
          ? isEditing
            ? "Updating..."
            : "Creating..."
          : isEditing
            ? "Update Task"
            : "Create Task"}
      </button>
    </form>
  );
}