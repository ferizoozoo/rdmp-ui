export async function login(email: string, password: string): Promise<{token: string | null}> {
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

export async function register(email: string, password: string): Promise<{token: string | null}> {
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