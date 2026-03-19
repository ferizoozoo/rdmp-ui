import { fetchWithAuth } from "../fetchWithAuth";

export async function addRoadmap(splitLinks: string[]) {
  const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/ai/roadmap`, {
      method: "POST",
      body: JSON.stringify({ links: splitLinks }),
    });
    const data = await res.json();
    return data;
}