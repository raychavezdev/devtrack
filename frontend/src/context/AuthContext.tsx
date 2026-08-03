import { useState } from "react";
import type { ReactNode } from "react";
import {
  isDemoModeEnabled,
  startDemoMode,
  stopDemoMode,
} from "../demo/demoStorage";
import { AuthContext } from "./authContextDefinition";

function getInitialToken(): string | null {
  return localStorage.getItem("token");
}

function getInitialDemoMode(): boolean {
  return !localStorage.getItem("token") && isDemoModeEnabled();
}

function getInitialUser(): string | null {
  const storedToken = localStorage.getItem("token");

  if (storedToken) {
    return localStorage.getItem("username");
  }

  if (isDemoModeEnabled()) {
    return "Demo User";
  }

  return null;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(getInitialToken);
  const [user, setUser] = useState<string | null>(getInitialUser);
  const [isDemo, setIsDemo] = useState<boolean>(getInitialDemoMode);

  const login = (access: string, refresh: string, username: string) => {
    stopDemoMode();

    localStorage.setItem("token", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("username", username);

    setToken(access);
    setUser(username);
    setIsDemo(false);
  };

  const startDemo = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    localStorage.removeItem("activeProjectId");

    startDemoMode();

    setToken(null);
    setUser("Demo User");
    setIsDemo(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    localStorage.removeItem("activeProjectId");

    stopDemoMode();

    setToken(null);
    setUser(null);
    setIsDemo(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isDemo,
        login,
        startDemo,
        logout,
        loading: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
