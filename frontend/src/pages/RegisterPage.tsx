import { useState } from "react";
import { registerRequest } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      await registerRequest(username, email, password);
      navigate("/login");
    } catch {
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-zinc-100">

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">DevTrack</h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Create your account to start managing tasks
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-6 text-center">
            Create Account
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded bg-red-500/10 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">

            <div>
              <label className="text-sm text-zinc-400 block mb-1">
                Username
              </label>
              <input
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400 block mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400 block mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

          </div>

          <button
            disabled={loading}
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 transition py-2 rounded font-medium"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-sm text-zinc-400 mt-6 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 hover:underline"
            >
              Sign in
            </Link>
          </p>

        </form>

      </div>

    </div>
  );
}

