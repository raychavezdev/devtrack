import type { Task } from "../types/task"

const API_URL = import.meta.env.VITE_API_URL

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks/`)

  if (!response.ok) {
    throw new Error("Failed to fetch tasks")
  }

  return response.json()
}


export async function createTask(task: {
  title: string
  description: string
  task_type: string
  priority: string
}): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  })

  if (!response.ok) {
    throw new Error("Failed to create task")
  }

  return response.json()
}

export async function updateTaskStatus(id: number, status: string) {
  const response = await fetch(`${API_URL}/tasks/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update task status");
  }

  return response.json();
}