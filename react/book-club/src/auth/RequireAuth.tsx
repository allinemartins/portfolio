import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isReady, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isReady) return <div style={{ padding: 24 }}>Carregando…</div>;

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}