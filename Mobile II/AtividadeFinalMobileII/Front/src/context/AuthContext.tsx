import React, { createContext, useContext, useState } from 'react';
import { getDatabase } from '../utils/database';

const ADMIN_USUARIO = 'admin';
const ADMIN_SENHA = 'admin123';

interface AuthContextData {
  isAdmin: boolean;
  // agora retorna Promise<boolean> porque pode consultar o SQLite
  loginAdmin: (usuario: string, senha: string) => Promise<boolean>;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextData>({
  isAdmin: false,
  loginAdmin: async () => false,
  logoutAdmin: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const loginAdmin = async (usuario: string, senha: string): Promise<boolean> => {
    // credenciais administrativas hardcoded
    if (usuario === ADMIN_USUARIO && senha === ADMIN_SENHA) {
      setIsAdmin(true);
      return true;
    }

    // tentar autenticar contra o banco SQLite (usuários locais)
    try {
      const db = await getDatabase();
      const user = await db.getFirstAsync('SELECT * FROM usuarios WHERE nome = ? AND senha = ?', [usuario, senha]);
      if (user) {
        setIsAdmin(true);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Erro ao verificar credenciais locais:', err && err.message ? err.message : String(err));
      return false;
    }
  };

  const logoutAdmin = () => setIsAdmin(false);

  return (
    <AuthContext.Provider value={{ isAdmin, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
