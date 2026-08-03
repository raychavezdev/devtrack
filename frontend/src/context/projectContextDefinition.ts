import { createContext } from "react";
import type { Project } from "../types/project";

export interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  fetchProjects: () => Promise<void>;
}

export const ProjectContext = createContext<ProjectContextType | null>(null);
