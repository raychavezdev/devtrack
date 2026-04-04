import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProject } from "../../context/ProjectContext";
import ProjectModal from "../ProjectModal";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { projects, activeProject, setActiveProject } = useProject();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  return (
    <>
      <header className="border-b border-zinc-800">
        <div className="max-w-5xl mx-auto p-4 flex justify-between items-center">
          {/* LOGO */}
          <h1
            onClick={() => navigate("/")}
            className="text-2xl font-bold cursor-pointer"
          >
            DevTrack
          </h1>

          <div className="flex items-center gap-4 relative">
            {/* NAV */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`
              }
            >
              Projects
            </NavLink>

            {/* PROJECT SELECTOR */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProjectMenuOpen(!projectMenuOpen);
                }}
                className="px-3 py-2 bg-zinc-800 rounded-lg text-sm"
              >
                📁 {activeProject?.name || "Select project"} ▾
              </button>

              {projectMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg z-50">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => {
                        setActiveProject(project);
                        setProjectMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-800"
                    >
                      📁 {project.name}
                    </button>
                  ))}

                  <div className="border-t border-zinc-800 my-1"></div>

                  <button
                    onClick={() => {
                      setProjectMenuOpen(false);
                      setProjectModalOpen(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-zinc-800"
                  >
                    + New Project
                  </button>
                </div>
              )}
            </div>

            {/* USER MENU */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenuOpen(!userMenuOpen);
                }}
                className="px-3 py-2 bg-zinc-800 rounded-lg text-sm"
              >
                👤 {user} ▾
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg">
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-800"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MODAL GLOBAL */}
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSaved={() => setProjectModalOpen(false)}
      />
    </>
  );
}
