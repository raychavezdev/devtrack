import { useState } from "react";
import { useProject } from "../context/ProjectContext";
import { fetchWithAuth } from "../api/fetchWithAuth";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (message: string) => void;
};

export default function ProjectModal({ isOpen, onClose, onSaved }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { setActiveProject, fetchProjects } = useProject();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newProject = await fetchWithAuth("/projects/", {
        method: "POST",
        body: JSON.stringify({ name, description }),
      });

      
      await fetchProjects();

      setActiveProject(newProject);

      setName("");
      setDescription("");

      onSaved?.("Project created successfully");
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
          className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-200 cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Create Project</h2>

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
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}