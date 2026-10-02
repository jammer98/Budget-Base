"use client";

import * as React from "react";
import { toast } from "sonner";
import * as api from "@/lib/api";
import { setUnauthorizedHandler } from "@/lib/api";
import type { User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "budgetbase.token";
const USER_KEY = "budgetbase.user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as User);
      }
    } catch {
      // localStorage unavailable — treat as logged out.
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persist = React.useCallback((nextUser: User, nextToken: string) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  }, []);

  const login = React.useCallback(
    async (email: string, password: string) => {
      const res = await api.login({ email, password });
      persist(res.user, res.token);
    },
    [persist]
  );

  const register = React.useCallback(
    async (name: string, email: string, password: string) => {
      const res = await api.register({ name, email, password });
      persist(res.user, res.token);
    },
    [persist]
  );

  const logout = React.useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  // Any 401 on an authenticated request anywhere in the app routes here.
  React.useEffect(() => {
    setUnauthorizedHandler(() => {
      toast.error("Your session expired. Please log in again.");
      logout();
    });
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const value = React.useMemo(
    () => ({ user, token, isLoading, login, register, logout }),
    [user, token, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}