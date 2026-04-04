import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { getProjects } from "../api/projects";
import type { Project } from "../types/project";

type ProjectContextType = {
  projects: Project[];
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
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
  const [activeProject, _setActiveProject] = useState<Project | null>(null);


  const setActiveProject = (project: Project | null) => {
    _setActiveProject(project);

    if (project) {
      localStorage.setItem("activeProjectId", project.id.toString());
    } else {
      localStorage.removeItem("activeProjectId");
    }
  };

  const fetchProjects = async () => {
    if (!token) return;

    try {
      const data = await getProjects();
      setProjects(data);

      const storedId = localStorage.getItem("activeProjectId");

      
      if (storedId) {
        const found = data.find((p) => p.id === Number(storedId));

        if (found) {
          _setActiveProject(found);
          return;
        }
      }

      
      if (data.length > 0) {
        setActiveProject(data[0]);
      } else {
        setActiveProject(null);
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