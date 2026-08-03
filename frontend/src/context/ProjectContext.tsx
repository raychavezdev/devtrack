import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { getProjects } from "../api/projects";
import type { Project } from "../types/project";
import { useAuth } from "../hooks/useAuth";
import { ProjectContext } from "./projectContextDefinition";

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const { token, isDemo } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProjectState] = useState<Project | null>(null);

  const fetchProjects = useCallback(async () => {
    const data = await getProjects();

    setProjects(data);

    const storedProjectId = Number(localStorage.getItem("activeProjectId"));

    const storedProject = data.find(
      (project) => project.id === storedProjectId,
    );

    setActiveProjectState(storedProject ?? data[0] ?? null);
  }, []);

  useEffect(() => {
    if (!token && !isDemo) {
      return;
    }

    const loadProjects = async () => {
      await fetchProjects();
    };

    void loadProjects();
  }, [token, isDemo, fetchProjects]);

  const setActiveProject = (project: Project | null) => {
    setActiveProjectState(project);

    if (project) {
      localStorage.setItem("activeProjectId", project.id.toString());
    } else {
      localStorage.removeItem("activeProjectId");
    }
  };

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
