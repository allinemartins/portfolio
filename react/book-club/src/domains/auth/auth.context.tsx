import { createContext, useContext, useEffect, useState, useRef } from 'react';
import keycloak_new from './keycloak';
import type { Member } from '../members/Member';

interface AuthContextData {
  user: Member | null;
  isAuthenticated: boolean;
  login: (provider?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializedRef = useRef(false); 
  const [user, setUser] = useState<Member | null>(null);  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  // initialize Keycloak on component mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    keycloak_new
      .init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false,
      })
      .then(authenticated => {
        if (authenticated && keycloak_new.tokenParsed) {
          const token = keycloak_new.tokenParsed as any;

          setUser({
            id: token.sub,
            name: token.name,
            email: token.email,
          });

          setIsAuthenticated(true);
        }
        setInitialized(true);
      });
  }, []);

  async function login(provider?: 'google' | 'microsoft') {
    await keycloak_new.login({
      redirectUri: window.location.origin + '/dashboard',
      idpHint: provider,
    });
  }

  function logout() {
      keycloak_new.logout({
      redirectUri: window.location.origin + '/login',
    });
    setUser(null);
    setIsAuthenticated(false);
  }

  if (!initialized) return null; // evita flicker

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
