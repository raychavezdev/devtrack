import type { Project } from "../types/project";
import type { Task } from "../types/task";

export const DEMO_PROJECT_ID = 100001;

export const demoProject: Project = {
  id: DEMO_PROJECT_ID,
  name: "DevTrayck Demo",
  description:
    "Explore DevTrayck by creating, editing, deleting, and organizing tasks.",
};

export const initialDemoTasks: Task[] = [
  {
    id: 200001,
    title: "Add task search",
    description: "Add a search field to filter tasks by title and description.",
    task_type: "feature",
    priority: "high",
    status: "pending",
    position: 1000,
    created_at: "2026-07-20T10:00:00.000Z",
    completed_at: null,
    project: DEMO_PROJECT_ID,
  },
  {
    id: 200002,
    title: "Improve mobile navigation",
    description:
      "Make the application navigation easier to use on smaller screens.",
    task_type: "improvement",
    priority: "medium",
    status: "pending",
    position: 2000,
    created_at: "2026-07-21T11:30:00.000Z",
    completed_at: null,
    project: DEMO_PROJECT_ID,
  },
  {
    id: 200003,
    title: "Write project documentation",
    description:
      "Document the installation process and the main application features.",
    task_type: "improvement",
    priority: "low",
    status: "pending",
    position: 3000,
    created_at: "2026-07-22T09:00:00.000Z",
    completed_at: null,
    project: DEMO_PROJECT_ID,
  },
  {
    id: 200004,
    title: "Build interactive demo",
    description:
      "Create a frontend demo that stores its information in the browser.",
    task_type: "feature",
    priority: "critical",
    status: "progress",
    position: 1000,
    created_at: "2026-07-23T09:15:00.000Z",
    completed_at: null,
    project: DEMO_PROJECT_ID,
  },
  {
    id: 200005,
    title: "Improve dashboard accessibility",
    description:
      "Review buttons, labels, focus states, and keyboard navigation.",
    task_type: "improvement",
    priority: "medium",
    status: "progress",
    position: 2000,
    created_at: "2026-07-24T13:30:00.000Z",
    completed_at: null,
    project: DEMO_PROJECT_ID,
  },
  {
    id: 200006,
    title: "Configure authentication",
    description:
      "Add JWT authentication and protected routes to the application.",
    task_type: "feature",
    priority: "high",
    status: "done",
    position: 1000,
    created_at: "2026-07-18T08:00:00.000Z",
    completed_at: "2026-07-24T16:20:00.000Z",
    project: DEMO_PROJECT_ID,
  },
  {
    id: 200007,
    title: "Add project management",
    description:
      "Allow authenticated users to create, edit, and delete projects.",
    task_type: "feature",
    priority: "high",
    status: "done",
    position: 2000,
    created_at: "2026-07-19T12:00:00.000Z",
    completed_at: "2026-07-25T18:30:00.000Z",
    project: DEMO_PROJECT_ID,
  },
  {
    id: 200008,
    title: "Deploy application",
    description:
      "Deploy the frontend and backend and verify the production environment.",
    task_type: "improvement",
    priority: "critical",
    status: "done",
    position: 3000,
    created_at: "2026-07-20T12:00:00.000Z",
    completed_at: "2026-07-27T18:30:00.000Z",
    project: DEMO_PROJECT_ID,
  },
];
