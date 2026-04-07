import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import ConfirmModal from "../components/ConfirmModal";
import type { Task } from "../types/task";
import { getTasks, updateTask, deleteTask } from "../api/tasks";
import { useProject } from "../context/ProjectContext";

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

import ProjectModal from "../components/ProjectModal";

interface ColumnProps {
  status: string;
  title: string;
  children: React.ReactNode;
}

const columns = ["pending", "progress", "done"];

function Dashboard() {
  const { activeProject } = useProject();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const progressTasks = tasks.filter((t) => t.status === "progress");
  const doneTasks = tasks.filter((t) => t.status === "done");

  function openCreateModal() {
    setEditingTask(null);
    setIsModalOpen(true);
  }

  function openEditModal(task: Task) {
    setEditingTask(task);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingTask(null);
  }

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
          task.id === activeId ? { ...task, status: newStatus } : task,
        ),
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
    const overTask = tasks[overIndex];

    if (!activeTask || !overTask) return;

    const newStatus = overTask.status;

    const newTasks = arrayMove(tasks, activeIndex, overIndex);
    newTasks[overIndex] = { ...newTasks[overIndex], status: newStatus };

    setTasks(newTasks);

    const columnTasks = newTasks.filter((t) => t.status === newStatus);
    const newIndex = columnTasks.findIndex((t) => t.id === activeId);

    const prevTask = columnTasks[newIndex - 1];
    const nextTask = columnTasks[newIndex + 1];

    let newPosition;

    if (!prevTask && !nextTask) newPosition = 1000;
    else if (!prevTask) newPosition = nextTask.position / 2;
    else if (!nextTask) newPosition = prevTask.position + 1000;
    else newPosition = (prevTask.position + nextTask.position) / 2;

    try {
      await updateTask(activeId, {
        status: newStatus,
        position: newPosition,
      });
    } catch (error) {
      console.error(error);
      fetchTasks();
    }

    setActiveTask(null);
  }

  const fetchTasks = async () => {
    if (!activeProject) return;

    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data.filter((t) => t.project === activeProject.id));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  async function confirmDelete() {
    if (!taskToDelete) return;

    try {
      await deleteTask(taskToDelete.id);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      setTaskToDelete(null);
      setSuccessMessage("Task deleted successfully");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [activeProject]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 2000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  if (loading && activeProject) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400 bg-zinc-950">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="flex justify-between items-center  px-8 mb-6">
        <div className={` ${!activeProject ? "hidden" : ""} `}>
          <h2 className="text-2xl font-semibold">{activeProject?.name}</h2>
          <p className="text-zinc-400 text-sm">Manage your tasks</p>
        </div>

        <button
          onClick={openCreateModal}
          className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg disabled:opacity-50 ${!activeProject ? "hidden" : ""}`}
        >
          + New Task
        </button>
      </div>
      <div className="max-w-5xl mx-auto px-8 mb-4">
        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 text-green-400 text-sm">
            {successMessage}
          </div>
        )}

        {/* EMPTY STATE PROYECTOS */}
        {!activeProject ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
            <div className="text-5xl mb-4">📁</div>

            <h2 className="text-xl font-semibold text-zinc-200 mb-2">
              No projects yet
            </h2>

            <p className="mb-4 text-sm text-zinc-500 text-center max-w-md">
              Create your first project to start organizing your tasks.
            </p>

            <button
              onClick={() => setProjectModalOpen(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              + Create Project
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 text-zinc-400">
            No tasks yet. Create your first task 🚀
          </div>
        ) : (
          <DndContext
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="grid md:grid-cols-3 gap-6">
              <Column
                status="pending"
                title={`Pending (${pendingTasks.length})`}
              >
                <SortableContext
                  items={pendingTasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {pendingTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDelete={(task) => setTaskToDelete(task)}
                      onEdit={(task) => openEditModal(task)}
                    />
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
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDelete={(task) => setTaskToDelete(task)}
                      onEdit={(task) => openEditModal(task)}
                    />
                  ))}
                </SortableContext>
              </Column>

              <Column status="done" title={`Done (${doneTasks.length})`}>
                <SortableContext
                  items={doneTasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {doneTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDelete={(task) => setTaskToDelete(task)}
                      onEdit={(task) => openEditModal(task)}
                    />
                  ))}
                </SortableContext>
              </Column>
            </div>

            <DragOverlay>
              {activeTask ? <TaskCard task={activeTask} /> : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* MODALS */}
      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        onClose={closeModal}
        onSaved={(message) => {
          fetchTasks();
          setSuccessMessage(message);
        }}
      />

      <ConfirmModal
        isOpen={!!taskToDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"?`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />

      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSaved={(message) => {
          setProjectModalOpen(false);
          setSuccessMessage(message);
        }}
      />
    </div>
  );
}

export default Dashboard;
