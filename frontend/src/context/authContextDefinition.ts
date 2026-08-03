import { createContext } from "react";

export interface AuthContextType {
  token: string | null;
  user: string | null;
  isDemo: boolean;
  login: (access: string, refresh: string, username: string) => void;
  startDemo: () => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
