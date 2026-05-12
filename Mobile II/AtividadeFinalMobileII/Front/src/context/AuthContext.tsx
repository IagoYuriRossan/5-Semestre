import React, { createContext, useContext, useState } from 'react';

const ADMIN_USUARIO = 'admin';
const ADMIN_SENHA = 'admin123';

interface AuthContextData {
  isAdmin: boolean;
  loginAdmin: (usuario: string, senha: string) => boolean;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextData>({
  isAdmin: false,
  loginAdmin: () => false,
  logoutAdmin: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const loginAdmin = (usuario: string, senha: string): boolean => {
    if (usuario === ADMIN_USUARIO && senha === ADMIN_SENHA) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => setIsAdmin(false);

  return (
    <AuthContext.Provider value={{ isAdmin, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
