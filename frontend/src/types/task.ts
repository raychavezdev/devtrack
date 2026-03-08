export type Task = {
  id: number
  title: string
  description: string
  task_type: string
  priority: string
  status: string
  created_at: string
  completed_at: string | null
}