import type { Project } from "../types/project";
import { useNavigate } from "react-router-dom";
import { useProject } from "../context/ProjectContext";

type Props = {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
};

export default function ProjectCard({ project, onEdit, onDelete }: Props) {
  const navigate = useNavigate();
  const { setActiveProject } = useProject();

  return (
    <div
      onClick={() => {
        setActiveProject(project);
        navigate("/");
      }}
      className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 cursor-pointer hover:border-indigo-500 transition hover:scale-[1.02]"
    >
      <h3 className="text-lg font-semibold">{project.name}</h3>

      <p className="text-zinc-400 mt-2 text-sm">
        {project.description || "No description"}
      </p>

      <div className="border-t border-zinc-800 mt-3 flex justify-end gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(project);
          }}
          className="text-blue-400 hover:text-blue-500 text-sm"
        >
          Edit
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(project);
          }}
          className="text-red-400 hover:text-red-500 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
