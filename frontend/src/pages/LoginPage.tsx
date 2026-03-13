import { useState } from "react";
import { loginRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginRequest(username, password);
      login(data.access);
      navigate("/");
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-zinc-950 to-zinc-900 text-zinc-100">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">DevTrack</h1>
          <p className="text-zinc-400 text-sm mt-2">
            Manage your development tasks
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-zinc-800 shadow-xl rounded-2xl p-8"
        >
          <h2 className="text-lg font-semibold mb-6 text-center">
            Sign in to your account
          </h2>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm text-zinc-400 mb-1">Username</label>
            <input
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-sm text-zinc-400 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
          )}

          {/* Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors py-2.5 rounded-lg font-medium">
            Sign in
          </button>

          <p className="text-sm text-zinc-400 mt-4 text-center">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-400 hover:underline">
              Register
            </a>
          </p>

        </form>

        {/* Footer */}
        <p className="text-center text-zinc-500 text-xs mt-6">
          DevTrack — Task management for developers
        </p>
      </div>
    </div>
  );
}
