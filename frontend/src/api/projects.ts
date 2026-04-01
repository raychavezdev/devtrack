import type { Project } from "../types/project";
import { fetchWithAuth } from "./fetchWithAuth";

const BASE = "/projects/";

export async function getProjects(): Promise<Project[]> {
  return fetchWithAuth(BASE);
}

export async function getProject(id: number): Promise<Project> {
  return fetchWithAuth(`${BASE}${id}/`);
}

export async function createProject(data: {
  name: string;
  description: string;
}): Promise<Project> {
  return fetchWithAuth(BASE, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProject(
  id: number,
  data: {
    name: string;
    description: string;
  }
): Promise<Project> {
  return fetchWithAuth(`${BASE}${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProject(id: number): Promise<void> {
  return fetchWithAuth(`${BASE}${id}/`, {
    method: "DELETE",
  });
}