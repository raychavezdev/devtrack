import type { Task } from "../types/task";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  task: Task;
};

function TaskCard({ task }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: task.id,
    });

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
      border border-zinc-800
      rounded-xl
      p-5
      transition
      hover:border-zinc-700
      hover:bg-zinc-800
      ${isDragging ? "opacity-40" : ""}
      `}
    >
      <h3 className="text-lg font-semibold">{task.title}</h3>

      <p className="text-zinc-400 mt-2 text-sm">{task.description}</p>

      <div className="flex gap-3 mt-4 text-xs">
        <span
          className="
          px-2 py-1
          bg-blue-500/10
          text-blue-400
          rounded-md
        "
        >
          {task.status}
        </span>

        <span
          className="
          px-2 py-1
          bg-purple-500/10
          text-purple-400
          rounded-md
        "
        >
          {task.priority}
        </span>
      </div>
    </div>
  );
}

export default TaskCard;
