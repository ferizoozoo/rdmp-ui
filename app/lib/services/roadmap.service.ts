import { parseRoadmap } from "../parseRoadmap";
import { Roadmap } from "@/app/types/roadmap";
import { fetchWithAuth } from "../fetchWithAuth";

type AddRoadmapResponse = {
  id?: string;
  roadmap?: unknown;
};

export async function addRoadmap(splitLinks: string[]): Promise<Roadmap> {
  const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/ai/roadmap`, {
    method: "POST",
    body: JSON.stringify({ links: splitLinks }),
  });

  const data = (await res.json()) as AddRoadmapResponse | Roadmap;
  const normalized =
    parseRoadmap(data.id, (data as AddRoadmapResponse).roadmap ?? data, {
      id: typeof (data as AddRoadmapResponse).id === "string" ? (data as AddRoadmapResponse).id : undefined,
    });

  if (!res.ok) {
    throw new Error("Could not create roadmap.");
  }

  if (!normalized) {
    throw new Error("Received an invalid roadmap from the backend.");
  }

  return normalized;
}
