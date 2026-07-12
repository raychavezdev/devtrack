import type { Task } from "../types/task";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const statusColors: Record<string, string> = {
  pending: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  progress: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  done: "bg-green-500/10 text-green-400 border-green-500/20",
};

const priorityColors: Record<string, string> = {
  low: "bg-green-500/10 text-green-400 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
};

interface Props {
  task: Task;
  isHighlighted?: boolean;
  onDelete?: (task: Task) => void;
  onEdit?: (task: Task) => void;
}

export default function TaskCard({
  task,
  isHighlighted,
  onDelete,
  onEdit,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`
      bg-zinc-900
      border border-zinc-700
      rounded-xl
      p-5
      cursor-grab
      hover:shadow-lg
      hover:border-blue-400
      transition
      ${isDragging ? "opacity-40" : ""}

      ${isHighlighted ? "animate-glow hover:border-zinc-700" : ""}
    `}
    >
      <h3 className="text-lg font-semibold">{task.title}</h3>

      <p className="text-zinc-400 mt-2 text-sm">{task.description}</p>

      <div className="mt-4 flex gap-3 text-xs">
        <span
          className={`rounded-md border px-2 py-1 capitalize ${
            statusColors[task.status] ??
            "border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
          }`}
        >
          {task.status}
        </span>

        <span
          className={`rounded-md border px-2 py-1 capitalize ${
            priorityColors[task.priority] ??
            "border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
          }`}
        >
          {task.priority}
        </span>
      </div>

      <div className="border-t border-zinc-800 mt-3 flex justify-end">
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onEdit?.(task)}
          className="p-1 text-xs text-blue-300 hover:text-blue-500"
        >
          Edit
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDelete?.(task)}
          className="p-1 text-xs text-gray-400 hover:text-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
