'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';
import useUser from '@/app/hooks/useUser';

function subscribe() {
  return () => {};
}

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useUser();
  const isMounted = useSyncExternalStore(subscribe, () => true, () => false);
  const router = useRouter();

  useEffect(() => {
    if (isMounted && !token) {
      router.push('/login');
    }
  }, [isMounted, token, router]);

  if (!isMounted) {
    return null;
  }

  if (!token) {
    return null;
  }

  return <>{children}</>;
}
