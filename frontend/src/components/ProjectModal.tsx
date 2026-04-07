import { useState, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import { fetchWithAuth } from "../api/fetchWithAuth";
import type { Project } from "../types/project";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (message: string) => void;
  project?: Project | null;
};

export default function ProjectModal({
  isOpen,
  onClose,
  onSaved,
  project,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { setActiveProject, fetchProjects } = useProject();

  const isEditing = !!project;

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
    } else {
      setName("");
      setDescription("");
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let savedProject;

      if (isEditing) {
        savedProject = await fetchWithAuth(`/projects/${project!.id}/`, {
          method: "PUT",
          body: JSON.stringify({ name, description }),
        });
      } else {
        savedProject = await fetchWithAuth("/projects/", {
          method: "POST",
          body: JSON.stringify({ name, description }),
        });
      }

      await fetchProjects();
      setActiveProject(savedProject);

      onSaved?.(
        isEditing
          ? "Project updated successfully"
          : "Project created successfully"
      );

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 p-6 rounded-xl w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-200"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit Project" : "Create Project"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2"
            required
          />

          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-medium w-full disabled:opacity-50"
          >
            {loading
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
              ? "Update Project"
              : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}