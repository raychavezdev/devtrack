import { useEffect, useState } from "react"
import TaskCard from "../components/TaskCard"
import type { Task } from "../types/task"
import { getTasks } from "../api/tasks"

function Dashboard() {

  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    getTasks().then(setTasks)
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      <div className="max-w-5xl mx-auto p-8">

        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            DevTrack
          </h1>

          <p className="text-zinc-400 mt-2">
            Manage bugs, improvements and development tasks
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">

          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}

        </div>

      </div>

    </div>
  )
}

export default Dashboard