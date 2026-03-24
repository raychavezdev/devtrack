import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { getProjects } from "../api/projects";
import type { Project } from "../types/project";

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
      const data = await getProjects();

      setProjects(data);

      if (!data.find((p) => p.id === activeProject?.id)) {
        setActiveProject(data[0] || null);
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
