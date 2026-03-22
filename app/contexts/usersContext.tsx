'use client';

import { createContext, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserContextType {
    token: string | null;
    setToken: (token: string | null) => void;
    login: (token: string) => void;
    logout: () => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem('accessToken');
  });
  const router = useRouter();

  function login(newToken: string) {
    localStorage.setItem('accessToken', newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem('accessToken');
    setToken(null);
    router.push('/login');
  }

  return (
    <UserContext value={{ token, setToken, login, logout }}>
      {children}
    </UserContext>
  );
}
