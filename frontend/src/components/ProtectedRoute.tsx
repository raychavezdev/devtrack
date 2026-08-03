import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, isDemo, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!token && !isDemo) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
