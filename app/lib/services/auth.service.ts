export async function login(email: string, password: string): Promise<{accessToken: string | null, refreshToken: string | null}> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    const data = await res.json();
    return data;
}

export async function register(email: string, password: string): Promise<{accessToken: string | null, refreshToken: string | null}> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/user/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    const data = await res.json();
    return data;
}

export async function refresh(refreshToken: string): Promise<{accessToken: string | null, refreshToken: string | null}> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/user/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
    })
    const data = await res.json();
    return data;
}