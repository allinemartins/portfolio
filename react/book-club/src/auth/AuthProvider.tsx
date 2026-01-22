import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { keycloak } from "./keycloak";

type AuthUser = {
  username?: string;
  email?: string;
  name?: string;
};

type AuthContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  user?: AuthUser;
  login: (redirectTo?: string) => void;
  logout: () => void;
  getAccessToken: () => Promise<string | undefined>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function extractUser(): AuthUser | undefined {
  const token = keycloak.tokenParsed as any;
  if (!token) return undefined;

  return {
    username: token?.preferred_username,
    email: token?.email,
    name: token?.name,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!keycloak.authenticated);
  const [user, setUser] = useState<AuthUser | undefined>(extractUser());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      const auth = !!keycloak.authenticated;
      setIsAuthenticated(auth);
      setUser(auth ? extractUser() : undefined);
    };

    // 1) sincroniza estado inicial (depois do keycloak.init no main.tsx)
    sync();
    setIsReady(true);

    // 2) assina eventos do Keycloak
    const prevOnAuthSuccess = keycloak.onAuthSuccess;
    const prevOnAuthLogout = keycloak.onAuthLogout;
    const prevOnAuthRefreshSuccess = keycloak.onAuthRefreshSuccess;
    const prevOnTokenExpired = keycloak.onTokenExpired;

    keycloak.onAuthSuccess = () => {
      prevOnAuthSuccess?.();
      sync();
    };

    keycloak.onAuthRefreshSuccess = () => {
      prevOnAuthRefreshSuccess?.();
      sync();
    };

    keycloak.onAuthLogout = () => {
      prevOnAuthLogout?.();
      sync();
    };

    keycloak.onTokenExpired = () => {
      prevOnTokenExpired?.();
      // tenta renovar e sincroniza depois
      keycloak
        .updateToken(30)
        .then(sync)
        .catch(() => {
          // se não renovar, marca deslogado (RequireAuth vai mandar pro /login)
          sync();
        });
    };

    // cleanup: restaura handlers anteriores (evita “vazar” em HMR do Vite)
    return () => {
      keycloak.onAuthSuccess = prevOnAuthSuccess;
      keycloak.onAuthLogout = prevOnAuthLogout;
      keycloak.onAuthRefreshSuccess = prevOnAuthRefreshSuccess;
      keycloak.onTokenExpired = prevOnTokenExpired;
    };
  }, []);

  // login com redirect opcional (útil pra voltar pra página que tentou acessar)
  const login = (redirectTo?: string) => {
    keycloak.login({
      redirectUri: redirectTo
        ? `${window.location.origin}${redirectTo}`
        : window.location.origin,
    });
  };

  const logout = () =>
    keycloak.logout({ redirectUri: `${window.location.origin}` });

  const getAccessToken = async () => {
    if (!keycloak.authenticated) return undefined;
    await keycloak.updateToken(30).catch(() => false);
    return keycloak.token;
  };

  const value = useMemo(
    () => ({ isReady, isAuthenticated, user, login, logout, getAccessToken }),
    [isReady, isAuthenticated, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
