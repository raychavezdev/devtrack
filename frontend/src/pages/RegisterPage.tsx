import { useState } from "react";
import { registerRequest, loginRequest } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await registerRequest(username, email, password);

      const data = await loginRequest(username, password);

      login(data.access, data.refresh, username);

      navigate("/");
    } catch (err: any) {
      const backendErrors: Record<string, string> = {};

      if (err.username) backendErrors.username = err.username[0];
      if (err.email) backendErrors.email = err.email[0];
      if (err.password) backendErrors.password = err.password[0];

      if (Object.keys(backendErrors).length > 0) {
        setErrors(backendErrors);
      } else {
        setErrors({ general: "Failed to register" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900 text-zinc-100">
      <div className="w-full max-w-md">
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight mt-4">DevTrack</h1>
          <p className="text-zinc-400 my-2 text-sm">
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

          {errors.general && (
            <div className="mb-4 p-3 rounded bg-red-500/10 text-red-400 text-sm">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            {/* USERNAME */}
            <div>
              <label className="text-sm text-zinc-400 block mb-1">
                Username
              </label>
              <input
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors((prev) => ({ ...prev, username: "" }));
                }}
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1">• {errors.username}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm text-zinc-400 block mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: "" }));
                }}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">• {errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-zinc-400 block mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">• {errors.password}</p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-sm text-zinc-400 block mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">
                  • {errors.confirmPassword}
                </p>
              )}
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
           {/* Footer */}
      <p className="text-center text-zinc-500 text-xs my-6">
        DevTrack — Task management for developers
      </p>
      </div>
   
    </div>
  );
}
