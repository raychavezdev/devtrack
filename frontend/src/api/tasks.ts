import type { Task } from "../types/task";
import { fetchWithAuth } from "./fetchWithAuth";

export async function getTasks(): Promise<Task[]> {
  return fetchWithAuth("/tasks/");
}

export async function createTask(task: {
  title: string;
  description: string;
  task_type: string;
  priority: string;
}): Promise<Task> {
  return fetchWithAuth("/tasks/", {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export async function updateTask(
  id: number,
  data: {
    status?: string;
    position?: number;
  }
): Promise<Task> {
  return fetchWithAuth(`/tasks/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function editTask(
  id: number,
  data: {
    title: string;
    description: string;
    task_type: string;
    priority: string;
  }
): Promise<Task> {
  return fetchWithAuth(`/tasks/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteTask(id: number) {
  await fetchWithAuth(`/tasks/${id}/`, {
    method: "DELETE",
  });

  return true;
}