import type { Task } from "../types/task";
import { initialDemoTasks } from "./demoData";

const DEMO_MODE_KEY = "devtrayck_demo_mode";
const DEMO_TASKS_KEY = "devtrayck_demo_tasks";

function cloneTasks(tasks: Task[]): Task[] {
  return tasks.map((task) => ({ ...task }));
}

function saveTasks(tasks: Task[]): void {
  localStorage.setItem(DEMO_TASKS_KEY, JSON.stringify(tasks));
}

export function isDemoModeEnabled(): boolean {
  return localStorage.getItem(DEMO_MODE_KEY) === "true";
}

export function startDemoMode(): void {
  localStorage.setItem(DEMO_MODE_KEY, "true");

  if (!localStorage.getItem(DEMO_TASKS_KEY)) {
    saveTasks(cloneTasks(initialDemoTasks));
  }
}

export function stopDemoMode(): void {
  localStorage.removeItem(DEMO_MODE_KEY);
}

export function resetDemoTasks(): Task[] {
  const tasks = cloneTasks(initialDemoTasks);

  saveTasks(tasks);

  return tasks;
}

export function getDemoTasks(): Task[] {
  const storedTasks = localStorage.getItem(DEMO_TASKS_KEY);

  if (!storedTasks) {
    return resetDemoTasks();
  }

  try {
    const tasks = JSON.parse(storedTasks) as Task[];

    if (!Array.isArray(tasks)) {
      return resetDemoTasks();
    }

    return tasks;
  } catch {
    return resetDemoTasks();
  }
}

export function getDemoTask(id: number): Task | null {
  return getDemoTasks().find((task) => task.id === id) ?? null;
}

export function createDemoTask(data: {
  title: string;
  description: string;
  task_type: string;
  priority: string;
  project: number;
}): Task {
  const tasks = getDemoTasks();

  const pendingTasks = tasks.filter((task) => task.status === "pending");

  const highestPosition = pendingTasks.reduce(
    (highest, task) => Math.max(highest, task.position),
    0,
  );

  const highestId = tasks.reduce(
    (highest, task) => Math.max(highest, task.id),
    200000,
  );

  const newTask: Task = {
    id: highestId + 1,
    title: data.title,
    description: data.description,
    task_type: data.task_type,
    priority: data.priority,
    status: "pending",
    position: highestPosition + 1000,
    created_at: new Date().toISOString(),
    completed_at: null,
    project: data.project,
  };

  saveTasks([...tasks, newTask]);

  return newTask;
}

export function updateDemoTask(
  id: number,
  data: {
    status?: string;
    position?: number;
    title?: string;
    description?: string;
    task_type?: string;
    priority?: string;
    project?: number;
  },
): Task {
  const tasks = getDemoTasks();
  const existingTask = tasks.find((task) => task.id === id);

  if (!existingTask) {
    throw new Error("Demo task not found");
  }

  const nextStatus = data.status ?? existingTask.status;

  const updatedTask: Task = {
    ...existingTask,
    ...data,
    completed_at:
      nextStatus === "done"
        ? (existingTask.completed_at ?? new Date().toISOString())
        : null,
  };

  const updatedTasks = tasks.map((task) =>
    task.id === id ? updatedTask : task,
  );

  saveTasks(updatedTasks);

  return updatedTask;
}

export function deleteDemoTask(id: number): void {
  const tasks = getDemoTasks();
  const filteredTasks = tasks.filter((task) => task.id !== id);

  saveTasks(filteredTasks);
}
