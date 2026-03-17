export async function login(email: string, password: string): Promise<{token: string | null}> {
    const res = await fetch('http://localhost:5018/user/login', {
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
    const res = await fetch('http://localhost:5018/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    const data = await res.json();
    return data;
}