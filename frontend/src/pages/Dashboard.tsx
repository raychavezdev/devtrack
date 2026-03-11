import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import type { Task } from "../types/task";
import { getTasks, updateTaskStatus } from "../api/tasks";
import TaskForm from "../components/TaskForm";

import {
  DndContext,
  DragOverlay,
  useDroppable,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

type ColumnProps = {
  status: string;
  title: string;
  children: React.ReactNode;
};

const columns = ["pending", "progress", "done"];

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const progressTasks = tasks.filter((t) => t.status === "progress");
  const doneTasks = tasks.filter((t) => t.status === "done");

  function Column({ status, title, children }: ColumnProps) {
    const { setNodeRef } = useDroppable({ id: status });

    return (
      <div ref={setNodeRef} className="bg-zinc-900 rounded-xl p-4">
        <h2 className="font-semibold mb-4 text-zinc-300">{title}</h2>
        <div className="space-y-3">{children}</div>
      </div>
    );
  }

  function handleDragStart(event: DragStartEvent) {
    const id = Number(event.active.id);
    const task = tasks.find((t) => t.id === id);

    if (task) setActiveTask(task);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = Number(active.id);
    const overId = over.id;

    const activeIndex = tasks.findIndex((t) => t.id === activeId);
    const activeTask = tasks[activeIndex];

    if (!activeTask) return;

    const overTask = tasks.find((t) => t.id === Number(overId));

    let newStatus = activeTask.status;

    if (columns.includes(String(overId))) {
      newStatus = String(overId);
    } else if (overTask) {
      newStatus = overTask.status;
    }

    if (newStatus !== activeTask.status) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === activeId ? { ...task, status: newStatus } : task
        )
      );
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = Number(active.id);
    const overId = Number(over.id);

    const activeIndex = tasks.findIndex((t) => t.id === activeId);
    const overIndex = tasks.findIndex((t) => t.id === overId);

    const activeTask = tasks[activeIndex];
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask) return;

    // reorder dentro de misma columna
    if (overTask && activeTask.status === overTask.status) {
      setTasks((tasks) => arrayMove(tasks, activeIndex, overIndex));
    }

    // cambio en backend
    try {
      await updateTaskStatus(activeId, activeTask.status);
    } catch (error) {
      console.error(error);
      fetchTasks();
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

        <DndContext
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid md:grid-cols-3 gap-6">
            <Column status="pending" title={`Pending (${pendingTasks.length})`}>
              <SortableContext
                items={pendingTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {pendingTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </SortableContext>
            </Column>

            <Column
              status="progress"
              title={`In Progress (${progressTasks.length})`}
            >
              <SortableContext
                items={progressTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {progressTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </SortableContext>
            </Column>

            <Column status="done" title={`Done (${doneTasks.length})`}>
              <SortableContext
                items={doneTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {doneTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </SortableContext>
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