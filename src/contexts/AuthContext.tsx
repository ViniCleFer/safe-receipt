import { createContext, ReactNode, useContext, useState } from 'react';
import { User } from '@supabase/supabase-js';

interface AuthContextProps {
  user: User | null;
  setAuthenticatedUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const setAuthenticatedUser = (user: User | null) => {
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, setAuthenticatedUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
