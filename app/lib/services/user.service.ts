export async function getById(id: string): Promise<{token: string | null}> {
    debugger
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/user/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
    })
    return await res.json();
}