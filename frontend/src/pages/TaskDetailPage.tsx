import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getTask } from "../api/tasks";
import type { Task } from "../types/task";
import TaskModal from "../components/TaskModal";

const statusColors: Record<string, string> = {
  pending: "border-zinc-500/20 bg-zinc-500/10 text-zinc-400",
  progress: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  done: "border-green-500/20 bg-green-500/10 text-green-400",
};

const priorityColors: Record<string, string> = {
  low: "border-green-500/20 bg-green-500/10 text-green-400",
  medium: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  high: "border-orange-500/20 bg-orange-500/10 text-orange-400",
  critical: "border-red-500/20 bg-red-500/10 text-red-400",
};

function formatDate(date: string | null) {
  if (!date) {
    return "Not completed";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function refreshTask() {
    if (!task) {
      return;
    }

    try {
      const updatedTask = await getTask(task.id);
      setTask(updatedTask);
    } catch (error) {
      console.error("Could not refresh task:", error);
      setError(
        "The task was updated, but its information could not be refreshed",
      );
    }
  }

  useEffect(() => {
    async function fetchTask() {
      const id = Number(taskId);

      if (!Number.isInteger(id) || id <= 0) {
        setError("Invalid task ID");
        setLoading(false);
        return;
      }

      try {
        const data = await getTask(id);
        setTask(data);
      } catch (error) {
        console.error(error);
        setError("Task not found or could not be loaded");
      } finally {
        setLoading(false);
      }
    }

    fetchTask();
  }, [taskId]);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSuccessMessage(null);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [successMessage]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center text-zinc-400">
        Loading task...
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-red-500/20 bg-red-500/10 p-8">
        <h1 className="text-xl font-semibold text-red-400">
          Unable to load task
        </h1>

        <p className="mt-2 text-sm text-zinc-400">
          {error ?? "The requested task does not exist."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white transition hover:bg-zinc-700"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  const statusClass =
    statusColors[task.status] ??
    "border-zinc-500/20 bg-zinc-500/10 text-zinc-400";

  const priorityClass =
    priorityColors[task.priority] ??
    "border-zinc-500/20 bg-zinc-500/10 text-zinc-400";

  return (
    <section className="mx-auto max-w-4xl">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
      >
        ← Back to dashboard
      </Link>

      {successMessage && (
        <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {successMessage}
        </div>
      )}
      <article className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg md:p-8">
        <header className="border-b border-zinc-800 pb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-zinc-500">Task #{task.id}</p>

              <h1 className="mt-2 text-3xl font-bold text-white">
                {task.title}
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
            >
              Edit task
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span
              className={`rounded-md border px-3 py-1 text-xs capitalize ${statusClass}`}
            >
              {task.status}
            </span>

            <span
              className={`rounded-md border px-3 py-1 text-xs capitalize ${priorityClass}`}
            >
              {task.priority}
            </span>

            <span className="rounded-md border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs capitalize text-purple-400">
              {task.task_type}
            </span>
          </div>
        </header>

        <div className="py-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Description
          </h2>

          <p className="mt-3 whitespace-pre-wrap leading-7 text-zinc-300">
            {task.description || "No description provided."}
          </p>
        </div>

        <footer className="grid gap-4 border-t border-zinc-800 pt-6 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Created
            </p>

            <p className="mt-1 text-sm text-zinc-300">
              {formatDate(task.created_at)}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Completed
            </p>

            <p className="mt-1 text-sm text-zinc-300">
              {formatDate(task.completed_at)}
            </p>
          </div>
        </footer>
      </article>

      <TaskModal
        isOpen={isEditModalOpen}
        task={task}
        onClose={() => setIsEditModalOpen(false)}
        onSaved={async (message) => {
          await refreshTask();
          setSuccessMessage(message);
        }}
      />
    </section>
  );
}
