import { fetchWithAuth } from "../fetchWithAuth";

export type UserProfileResponse = {
    name?: string;
    email?: string;
    token?: string | null;
};

export async function getById(id: string): Promise<UserProfileResponse> {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/user/${id}`, {
        method: 'GET',
    })
    return await res.json();
}
