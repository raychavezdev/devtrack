import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import type { Task } from "../types/task";
import { getTasks } from "../api/tasks";
import TaskForm from "../components/TaskForm";

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const progressTasks = tasks.filter((task) => task.status === "progress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400 bg-zinc-950">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto p-8">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">DevTrack</h1>

          <p className="text-zinc-400 mt-2">
            Manage bugs, improvements and development tasks
          </p>
        </header>

        <TaskForm onTaskCreated={fetchTasks} />

        {tasks.length === 0 && (
          <div className="text-center py-12 text-zinc-400">
            No tasks yet. Create your first task 🚀
          </div>
        )}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 rounded-xl p-4">
            <h2 className="font-semibold mb-4 text-zinc-300">
              Pending ({pendingTasks.length})
            </h2>

            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-4">
            <h2 className="font-semibold mb-4 text-zinc-300">
              In Progress ({progressTasks.length})
            </h2>

            <div className="space-y-3">
              {progressTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-4">
            <h2 className="font-semibold mb-4 text-zinc-300">Done ({doneTasks.length})</h2>

            <div className="space-y-3">
              {doneTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
