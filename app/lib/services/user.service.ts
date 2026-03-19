import { fetchWithAuth } from "../fetchWithAuth";

export async function getById(id: string): Promise<{token: string | null}> {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/user/${id}`, {
        method: 'GET',
    })
    return await res.json();
}