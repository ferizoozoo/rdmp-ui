'use client';

import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserContextType {
    token: string | null;
    setToken: (token: string | null) => void;
    login: (token: string) => void;
    logout: () => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      setToken(stored);
    }
  }, []);

  function login(newToken: string) {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    router.push('/login');
  }

  return (
    <UserContext value={{ token, setToken, login, logout }}>
      {children}
    </UserContext>
  );
}