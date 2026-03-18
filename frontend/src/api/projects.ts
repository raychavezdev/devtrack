import type { Project } from "../context/ProjectContext";

export async function getProjects(token: string): Promise<Project[]> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch projects");

  const data: Project[] = await res.json();
  return data;
}