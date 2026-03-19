import { refresh, refreshToken } from '@/app/lib/services/auth.service';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const refreshTokenValue = localStorage.getItem('refreshToken');

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  // Token expired — try to refresh once
  if (res.status === 401) {
    const { accessToken: newToken, refreshToken: newRefreshToken } = await refresh(refreshTokenValue);

    if (!newToken) {
      window.location.href = '/login'; // force logout
      return res;
    }

    localStorage.setItem('token', newToken);
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    } 

    // Retry original request with new token
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  return res;
}