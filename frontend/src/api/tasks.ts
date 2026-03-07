export type Task = {
  id: number
  title: string
  description: string
  status: string
  priority: string
  created_at: string
}

const API_URL = import.meta.env.VITE_API_URL

export async function getTasks() {

  const response = await fetch(`${API_URL}/tasks/`)

  if (!response.ok) {
    throw new Error("Failed to fetch tasks")
  }

  return response.json()
}