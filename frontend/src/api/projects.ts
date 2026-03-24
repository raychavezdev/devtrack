import type { Project } from "../context/ProjectContext";
import { fetchWithAuth } from "./fetchWithAuth";

export async function getProjects(): Promise<Project[]> {
  return fetchWithAuth("/projects/");
}