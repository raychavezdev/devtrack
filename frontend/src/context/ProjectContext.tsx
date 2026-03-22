import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";

export type Project = {
  id: number;
  name: string;
  description: string;
};

type ProjectContextType = {
  projects: Project[];
  activeProject: Project | null;
  setActiveProject: (project: Project) => void;
  fetchProjects: () => Promise<void>;
};

const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  activeProject: null,
  setActiveProject: () => {},
  fetchProjects: async () => {},
});

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch projects");

      const data: Project[] = await res.json();

      setProjects(data);

      // si no hay proyecto activo, asigna el primero
      if (!activeProject && data.length > 0) {
        setActiveProject(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [token]);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        setActiveProject,
        fetchProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);