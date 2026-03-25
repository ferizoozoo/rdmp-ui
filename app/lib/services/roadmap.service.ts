import { cacheRoadmap, parseRoadmap } from "../../lib/roadmap/utils";
import { Roadmap } from "@/app/types/roadmap";
import { fetchWithAuth } from "../fetchWithAuth";

type AddRoadmapResponse = {
  id?: string;
  roadmap?: unknown;
  createdAt?: string;
};

export type RoadmapRequestInput = {
  links?: string[];
  jobDescription?: string;
};

const roadmapByIdRequests = new Map<string, Promise<Roadmap>>();
const roadmapByUserIdRequests = new Map<string, Promise<Roadmap>>();

export async function addRoadmap(input: RoadmapRequestInput): Promise<Roadmap> {
  const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/ai/roadmap`, {
    method: "POST",
    body: JSON.stringify({
      links: input.links ?? [],
      jobDescription: input.jobDescription ?? "",
      description: input.jobDescription ?? "",
      jobPostText: input.jobDescription ?? "",
    }),
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

  cacheRoadmap(normalized);
  return normalized;
}

export async function getRoadmapById(id: string): Promise<Roadmap> {
  const existingRequest = roadmapByIdRequests.get(id);

  if (existingRequest) {
    return existingRequest;
  }

  const request = (async () => {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/roadmap/${id}`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Could not fetch any roadmap.");
    }

    const data = (await res.json()) as AddRoadmapResponse | Roadmap;
    const normalized =
      parseRoadmap(id, (data as AddRoadmapResponse).roadmap ?? data, {
        id:
          typeof (data as AddRoadmapResponse).id === "string"
            ? (data as AddRoadmapResponse).id
            : id,
      });

    if (!res.ok) {
      throw new Error("Could not create roadmap.");
    }

    if (!normalized) {
      throw new Error("Received an invalid roadmap from the backend.");
    }

    cacheRoadmap(normalized);
    return normalized;
  })().finally(() => {
    roadmapByIdRequests.delete(id);
  });

  roadmapByIdRequests.set(id, request);
  return request;
}

export async function getRoadmapByUserId(id: string): Promise<Roadmap> {
  const existingRequest = roadmapByUserIdRequests.get(id);

  if (existingRequest) {
    return existingRequest;
  }

  const request = (async () => {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/roadmap/user/${id}`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Could not fetch any roadmap.");
    }

    const data = (await res.json()) as AddRoadmapResponse | Roadmap;
    const normalized =
      parseRoadmap(id, (data as AddRoadmapResponse).roadmap ?? data, {
        id:
          typeof (data as AddRoadmapResponse).id === "string"
            ? (data as AddRoadmapResponse).id
            : id,
      });

    if (!res.ok) {
      throw new Error("Could not create roadmap.");
    }

    if (!normalized) {
      throw new Error("Received an invalid roadmap from the backend.");
    }

    cacheRoadmap(normalized);
    return normalized;
  })().finally(() => {
    roadmapByUserIdRequests.delete(id);
  });

  roadmapByUserIdRequests.set(id, request);
  return request;
}
