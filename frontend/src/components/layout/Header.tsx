import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProject } from "../../context/ProjectContext";

export default function Header() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { projects, activeProject, setActiveProject } = useProject();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);

  return (
    <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between bg-zinc-950">
      
      {/* LEFT */}
      <div className="flex items-center gap-6">
        {/* LOGO */}
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold cursor-pointer hover:text-indigo-400 transition"
        >
          DevTrack
        </h1>

        {/* NAV */}
        <nav className="flex gap-4 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-white font-medium"
                : "text-zinc-400 hover:text-white"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive
                ? "text-white font-medium"
                : "text-zinc-400 hover:text-white"
            }
          >
            Projects
          </NavLink>
        </nav>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">
        
        {/* PROJECT SELECTOR */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setProjectMenuOpen(!projectMenuOpen);
              setUserMenuOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm"
          >
            📁 {activeProject?.name || "Select project"}
            <span className="text-zinc-400">▾</span>
          </button>

          {projectMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg z-50">
              
              {projects.length === 0 ? (
                <div className="px-4 py-3 text-sm text-zinc-400">
                  No projects
                </div>
              ) : (
                projects.map((project) => (
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
                ))
              )}

              <div className="border-t border-zinc-800 my-1"></div>

              <button
                onClick={() => {
                  setProjectMenuOpen(false);
                  navigate("/projects");
                }}
                className="w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-zinc-800"
              >
                Manage projects
              </button>
            </div>
          )}
        </div>

        {/* USER */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setUserMenuOpen(!userMenuOpen);
              setProjectMenuOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm"
          >
            👤 {user}
            <span className="text-zinc-400">▾</span>
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
    </header>
  );
}