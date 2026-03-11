import type { Task } from "../types/task";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { deleteTask } from "../api/tasks";

type Props = {
  task: Task;
  onTaskDeleted?: (id: number) => void;
};

function TaskCard({ task, onTaskDeleted }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = async () => {
    console.log("handleDelete");
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTask(task.id);
      if (onTaskDeleted) onTaskDeleted(task.id);
    } catch (error) {
      console.error(error);
      alert("Failed to delete task");
    }
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
      cursor-pointer
      hover:shadow-lg
    hover:border-blue-400 
      transition
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

      <div className="border-t border-zinc-800 mt-3 flex justify-end">
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleDelete}
          className="text-xs mt-2 text-gray-400 hover:text-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
