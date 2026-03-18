import type { Task } from "../types/task";
import { fetchWithAuth } from "./fetchWithAuth";

// Obtener tareas (opcionalmente por project_id)
export async function getTasks(projectId?: number): Promise<Task[]> {
  let url = "/tasks/";
  if (projectId) {
    url += `?project=${projectId}`;
  }
  return fetchWithAuth(url);
}

// Crear tarea con project_id
export async function createTask(task: {
  title: string;
  description: string;
  task_type: string;
  priority: string;
  project: number; // <-- nuevo campo
}): Promise<Task> {
  return fetchWithAuth("/tasks/", {
    method: "POST",
    body: JSON.stringify(task),
  });
}

// Actualizar status y posición (sin cambios)
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

// Editar tarea (sin cambios, solo título, descripción, tipo, prioridad)
export async function editTask(
  id: number,
  data: {
    title: string;
    description: string;
    task_type: string;
    priority: string;
    project?: number; // opcional si quieres permitir mover de proyecto
  }
): Promise<Task> {
  return fetchWithAuth(`/tasks/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Eliminar tarea (sin cambios)
export async function deleteTask(id: number) {
  await fetchWithAuth(`/tasks/${id}/`, { method: "DELETE" });
  return true;
}