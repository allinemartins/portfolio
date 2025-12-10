import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(() => {
    return localStorage.getItem("auth") === "true";
  });

  const login = () => {
    localStorage.setItem("auth", "true");
    setAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}