# DevTrayck

A full-stack task management application designed to help developers organize projects and track bugs, features, improvements, and refactoring tasks through a simple Kanban workflow.

## Overview

DevTrayck provides a centralized workspace where users can create projects, manage development tasks, and move work between **Pending**, **In Progress**, and **Done** columns using drag and drop.

The project was built as a practical full-stack application using React and Django REST Framework, with JWT authentication and user-specific data isolation.

## Features

- User registration and login
- JWT-based authentication
- Protected application routes
- Create, edit, and delete projects
- Create, edit, and delete tasks
- Organize tasks by project
- Kanban board with three workflow stages:
  - Pending
  - In Progress
  - Done

- Drag-and-drop task movement and reordering
- Task priorities:
  - Low
  - Medium
  - High
  - Critical

- Task types:
  - Bug
  - Feature
  - Improvement
  - Refactor

- Automatic completion timestamps
- Responsive dark interface
- User-specific projects and tasks

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- dnd-kit
- ESLint

### Backend

- Python
- Django
- Django REST Framework
- Simple JWT
- django-cors-headers
- SQLite

## Project Structure

```text
devtrayck/
├── backend/
│   ├── devtrayck_api/       # Django project configuration
│   ├── tasks/              # Projects, tasks, serializers, views, and routes
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/            # API requests and authenticated fetch utilities
│   │   ├── components/     # Reusable UI components and modals
│   │   ├── context/        # Authentication and project state
│   │   ├── pages/          # Login, registration, projects, and dashboard pages
│   │   └── types/          # TypeScript models
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

Make sure the following tools are installed:

- Python 3
- Node.js
- npm
- Git

## Backend Setup

From the project root:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it.

On Windows:

```bash
venv\Scripts\activate
```

On macOS or Linux:

```bash
source venv/bin/activate
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

Apply the database migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

The backend API will be available at:

```text
http://127.0.0.1:8000/
```

## Frontend Setup

Open another terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173/
```

## API Endpoints

| Method      | Endpoint              | Description                            |
| ----------- | --------------------- | -------------------------------------- |
| `POST`      | `/api/register/`      | Register a new user                    |
| `POST`      | `/api/token/`         | Obtain access and refresh tokens       |
| `POST`      | `/api/token/refresh/` | Refresh an access token                |
| `GET`       | `/api/projects/`      | List the authenticated user's projects |
| `POST`      | `/api/projects/`      | Create a project                       |
| `GET`       | `/api/projects/:id/`  | Retrieve a project                     |
| `PUT/PATCH` | `/api/projects/:id/`  | Update a project                       |
| `DELETE`    | `/api/projects/:id/`  | Delete a project                       |
| `GET`       | `/api/tasks/`         | List the authenticated user's tasks    |
| `POST`      | `/api/tasks/`         | Create a task                          |
| `GET`       | `/api/tasks/:id/`     | Retrieve a task                        |
| `PUT/PATCH` | `/api/tasks/:id/`     | Update a task                          |
| `DELETE`    | `/api/tasks/:id/`     | Delete a task                          |

Protected endpoints require an access token:

```http
Authorization: Bearer <access_token>
```

## Available Scripts

From the `frontend` directory:

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run preview
```

Previews the production build locally.

## Roadmap

Potential future improvements include:

- Search and filtering
- Due dates
- Task labels
- Project statistics
- Activity history
- Password recovery
- Automated tests
- PostgreSQL support for production
- Docker configuration
- Cloud deployment

## Author

**Raymundo Chavez**

- GitHub: [@raychavezdev](https://github.com/raychavezdev)

## License

This project currently does not include a license.
