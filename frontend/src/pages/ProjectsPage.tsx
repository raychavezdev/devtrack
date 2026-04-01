import { useState } from "react";
import { useProject } from "../context/ProjectContext";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import ConfirmModal from "../components/ConfirmModal";
import type { Project } from "../types/project";
import { deleteProject } from "../api/projects";

export default function ProjectsPage() {
  const { projects, fetchProjects } = useProject();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);


  const handleCreate = () => {
    setEditingProject(null);
    setModalOpen(true);
  };


  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setModalOpen(true);
  };


  const confirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      await deleteProject(projectToDelete.id);

      await fetchProjects(); 

      setProjectToDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto p-8">
        
       
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Projects</h1>

          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg"
          >
            + New Project
          </button>
        </div>

       
        {projects.length === 0 ? (
          <div className="text-center text-zinc-400 py-20">
            No projects yet 🚀
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onDelete={setProjectToDelete}
              />
            ))}
          </div>
        )}
      </div>


      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        project={editingProject}
        onSaved={() => {
          setModalOpen(false);
          fetchProjects();
        }}
      />

     
      <ConfirmModal
        isOpen={!!projectToDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.name}"?`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setProjectToDelete(null)}
      />
    </div>
  );
}