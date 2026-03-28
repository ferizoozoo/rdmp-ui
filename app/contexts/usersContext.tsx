'use client';

import { createContext, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';

interface UserContextType {
    token: string | null;
    setToken: (token: string | null) => void;
    login: (token: string) => void;
    logout: () => void;
}

export const UserContext = createContext<UserContextType | null>(null);

const AUTH_TOKEN_EVENT = 'rdmp-auth-token-change';

function subscribe(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(AUTH_TOKEN_EVENT, onStoreChange);

  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(AUTH_TOKEN_EVENT, onStoreChange);
  };
}

function getSnapshot() {
  return localStorage.getItem('accessToken');
}

function getServerSnapshot() {
  return null;
}

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const router = useRouter();

  function login(newToken: string) {
    localStorage.setItem('accessToken', newToken);
    window.dispatchEvent(new Event(AUTH_TOKEN_EVENT));
    router.push('/');
  }

  function logout() {
    localStorage.removeItem('accessToken');
    window.dispatchEvent(new Event(AUTH_TOKEN_EVENT));
    router.push('/login');
  }

  return (
    <UserContext
      value={{
        token,
        setToken: (nextToken) => {
          if (nextToken) {
            localStorage.setItem('accessToken', nextToken);
          } else {
            localStorage.removeItem('accessToken');
          }

          window.dispatchEvent(new Event(AUTH_TOKEN_EVENT));
        },
        login,
        logout,
      }}
    >
      {children}
    </UserContext>
  );
}
