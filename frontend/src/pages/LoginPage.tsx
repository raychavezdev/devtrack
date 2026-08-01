import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginRequest } from "../api/auth";
import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginRequest(username, password);

      login(data.access, data.refresh, username);
      navigate("/");
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-zinc-950 to-zinc-900 px-4 text-zinc-100">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <BrandLogo showTagline />
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl"
        >
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold text-white">Welcome back</h1>

            <p className="mt-2 text-sm text-zinc-400">
              Sign in to continue organizing your projects.
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="username"
              className="mb-1 block text-sm text-zinc-400"
            >
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="mb-1 block text-sm text-zinc-400"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-center text-sm text-red-400"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
            )}

            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="mt-5 text-center text-sm text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-400 transition hover:text-indigo-300 hover:underline"
            >
              Create one
            </Link>
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Plan. Build. Ship.
        </p>
      </div>
    </div>
  );
}
