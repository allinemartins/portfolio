import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Member } from '../members/Member';

interface AuthContextData {
  user: Member | null;
  isAuthenticated: boolean;
  login(credentials: {
    email?: string;
    password?: string;
    provider?: 'google' | 'microsoft';
  }): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextData | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Member | null>(null);

  async function login(credentials) {
  if (credentials.provider) {
      // SSO fake
      setUser({
        id: 'sso-user',
        name: 'Usuário SSO',
        email: 'sso@clubinho.com',
      });
      return;
    }

    // email + password fake
    setUser({
      id: 'email-user',
      name: credentials.email!,
      email: credentials.email!,
    });
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
