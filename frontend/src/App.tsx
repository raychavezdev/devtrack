import { useEffect, useState } from "react";
import type { Task } from "./api/tasks";
import { getTasks } from "./api/tasks";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks().then(setTasks);
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">DevTrack</h1>

      {tasks.map((task) => (
        <div key={task.id} className="border p-4 mb-2 rounded">
          {task.title}
        </div>
      ))}
    </div>
  );
}

export default App;
