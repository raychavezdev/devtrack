import TaskForm from "./TaskForm";
import type { Task } from "../types/task";
import { useProject } from "../context/ProjectContext";

type Props = {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onSaved: (message: string) => void;
};

export default function TaskModal({ isOpen, task, onClose, onSaved }: Props) {
  const { activeProject } = useProject(); // obtener proyecto activo

  if (!isOpen) return null;

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

        <TaskForm
          task={task}
          projectId={activeProject?.id}
          onTaskSaved={(message) => {
            onSaved(message);
            onClose();
          }}
        />
      </div>
    </div>
  );
}