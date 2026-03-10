import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import type { Task } from "../types/task";
import { getTasks } from "../api/tasks";
import TaskForm from "../components/TaskForm";
import { DndContext, DragOverlay  } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { updateTaskStatus } from "../api/tasks";
import type { DragStartEvent } from "@dnd-kit/core";

type ColumnProps = {
  status: string;
  title: string;
  children: React.ReactNode;
};

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const progressTasks = tasks.filter((task) => task.status === "progress");
  const doneTasks = tasks.filter((task) => task.status === "done");
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  function Column({ status, title, children }: ColumnProps) {
    const { setNodeRef } = useDroppable({
      id: status,
    });

    return (
      <div ref={setNodeRef} className="bg-zinc-900 rounded-xl p-4">
        <h2 className="font-semibold mb-4 text-zinc-300">{title}</h2>
        <div className="space-y-3">{children}</div>
      </div>
    );
  }

  function handleDragStart(event: DragStartEvent) {
    const taskId = Number(event.active.id);
    const task = tasks.find((t) => t.id === taskId);
    if (task) setActiveTask(task);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = over.id as string;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );

    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error(error);
      fetchTasks(); // rollback si falla
    }

    setActiveTask(null);
  }

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

        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          <div className="grid md:grid-cols-3 gap-6">
            <Column status="pending" title={`Pending (${pendingTasks.length})`}>
              {pendingTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </Column>

            <Column
              status="progress"
              title={`In Progress (${progressTasks.length})`}
            >
              {progressTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </Column>

            <Column status="done" title={`Done (${doneTasks.length})`}>
              {doneTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </Column>
          </div>
          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

export default Dashboard;
