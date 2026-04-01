import type { Task } from "../types/task";
import { fetchWithAuth } from "./fetchWithAuth";

const BASE = "/tasks/";

export async function getTasks(projectId?: number): Promise<Task[]> {
  let url = BASE;
  if (projectId) {
    url += `?project=${projectId}`;
  }
  return fetchWithAuth(url);
}


export async function createTask(task: {
  title: string;
  description: string;
  task_type: string;
  priority: string;
  project: number;
}): Promise<Task> {
  return fetchWithAuth(BASE, {
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
  return fetchWithAuth(`${BASE}${id}/`, {
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
    project?: number;
  }
): Promise<Task> {
  return fetchWithAuth(`${BASE}${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}


export async function deleteTask(id: number) {
  await fetchWithAuth(`${BASE}${id}/`, { method: "DELETE" });
  return true;
}