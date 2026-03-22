'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [token] = useState<string | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem('accessToken');
  });
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  if (!token) return null;

  return <>{children}</>;
}
