'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('accessToken');
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  if (!token) return null;

  return <>{children}</>;
}