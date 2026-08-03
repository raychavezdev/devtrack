import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginRequest, registerRequest } from "../api/auth";
import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../hooks/useAuth";

interface RegisterBackendError {
  username?: string[];
  email?: string[];
  password?: string[];
  detail?: string;
}

function isRegisterBackendError(error: unknown): error is RegisterBackendError {
  return typeof error === "object" && error !== null;
}

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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
    } catch (error: unknown) {
      const backendErrors: Record<string, string> = {};

      if (isRegisterBackendError(error)) {
        if (error.username?.[0]) {
          backendErrors.username = error.username[0];
        }

        if (error.email?.[0]) {
          backendErrors.email = error.email[0];
        }

        if (error.password?.[0]) {
          backendErrors.password = error.password[0];
        }

        if (Object.keys(backendErrors).length === 0 && error.detail) {
          backendErrors.general = error.detail;
        }
      }

      if (Object.keys(backendErrors).length > 0) {
        setErrors(backendErrors);
      } else {
        setErrors({
          general: "We could not create your account. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-zinc-950 to-zinc-900 px-4 py-8 text-zinc-100">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <BrandLogo showTagline />
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl"
        >
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold text-white">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Start organizing your development projects.
            </p>
          </div>

          {errors.general && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
            >
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            <div>
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
                disabled={loading}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Choose a username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setErrors((previous) => ({
                    ...previous,
                    username: "",
                  }));
                }}
              />

              {errors.username && (
                <p className="mt-1 text-xs text-red-400">{errors.username}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm text-zinc-400"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={loading}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrors((previous) => ({
                    ...previous,
                    email: "",
                  }));
                }}
              />

              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
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
                autoComplete="new-password"
                required
                disabled={loading}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="At least 6 characters"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrors((previous) => ({
                    ...previous,
                    password: "",
                  }));
                }}
              />

              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1 block text-sm text-zinc-400"
              >
                Confirm password
              </label>

              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                disabled={loading}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setErrors((previous) => ({
                    ...previous,
                    confirmPassword: "",
                  }));
                }}
              />

              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
            )}

            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-400 transition hover:text-indigo-300 hover:underline"
            >
              Sign in
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
