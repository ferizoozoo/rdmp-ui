import { cacheRoadmap, parseRoadmap } from "../../lib/roadmap/utils";
import { Roadmap } from "@/app/types/roadmap";
import { fetchWithAuth } from "../fetchWithAuth";

type AddRoadmapResponse = {
  id?: string;
  content?: unknown;
  roadmap?: unknown;
  createdAt?: string;
};

type RoadmapCollectionResponse =
  | AddRoadmapResponse
  | AddRoadmapResponse[]
  | {
      roadmaps?: AddRoadmapResponse[];
      data?: AddRoadmapResponse[];
      items?: AddRoadmapResponse[];
      results?: AddRoadmapResponse[];
    };

export type UserRoadmapEntry = {
  id: string;
  roadmap: Roadmap;
  createdAt: string;
};

export type RoadmapRequestInput = {
  links?: string[];
  jobDescription?: string;
};

export type TrelloExportResult = {
  url?: string;
  boardUrl?: string;
  link?: string;
  message?: string;
  error?: string;
  detail?: string;
  title?: string;
  [key: string]: unknown;
};

export type TrelloConnectionResult = {
  success?: boolean;
  message?: string;
  error?: string;
  detail?: string;
  title?: string;
  [key: string]: unknown;
};

const roadmapByIdRequests = new Map<string, Promise<Roadmap>>();
const allRoadmapsByUserIdRequests = new Map<string, Promise<UserRoadmapEntry[]>>();

function extractRoadmapSource(value: unknown): unknown {
  if (!value || typeof value !== "object") {
    return value;
  }

  const record = value as {
    roadmap?: unknown;
    content?: unknown;
    contents?: Array<{
      parts?: Array<{
        text?: unknown;
      }>;
    }>;
  };

  if (record.roadmap) {
    return record.roadmap;
  }

  if (typeof record.content === "string") {
    try {
      return extractRoadmapSource(JSON.parse(record.content));
    } catch {
      return record.content;
    }
  }

  if (record.content && typeof record.content === "object") {
    return extractRoadmapSource(record.content);
  }

  if (Array.isArray(record.contents)) {
    const textParts = record.contents.flatMap((content) =>
      Array.isArray(content.parts) ? content.parts.map((part) => part.text).filter(Boolean) : []
    );

    if (textParts.length === 1) {
      return textParts[0];
    }

    if (textParts.length > 1) {
      return textParts.join("\n");
    }
  }

  return value;
}

function normalizeUserRoadmapEntry(item: unknown, index: number): UserRoadmapEntry | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const record = item as AddRoadmapResponse & { _id?: string | number; id?: string | number };
  const fallbackId =
    typeof record.id === "string"
      ? record.id
      : typeof record.id === "number"
        ? String(record.id)
        : typeof record._id === "number"
          ? String(record._id)
        : typeof record._id === "string"
        ? record._id
        : undefined;
  const roadmapSource = extractRoadmapSource(record);
  const normalized = parseRoadmap(fallbackId ?? `roadmap-${index}`, roadmapSource, {
    id: fallbackId,
  });

  if (!normalized && !fallbackId) {
    return null;
  }

  return {
    id: fallbackId ?? normalized!.id,
    roadmap:
      normalized ?? {
        id: fallbackId ?? `roadmap-${index}`,
        skills: [],
        projects: [],
        timeline: [],
      },
    createdAt: typeof record.createdAt === "string" ? record.createdAt : new Date().toISOString(),
  };
}

function normalizeUserRoadmapEntries(data: RoadmapCollectionResponse): UserRoadmapEntry[] {
  const items = Array.isArray(data)
    ? data
    : Array.isArray(data.roadmaps)
      ? data.roadmaps
      : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.items)
          ? data.items
          : Array.isArray(data.results)
            ? data.results
            : [data];

  return items
    .map((item, index) => normalizeUserRoadmapEntry(item, index))
    .filter((entry): entry is UserRoadmapEntry => entry !== null);
}

async function readJsonResponse<T>(res: Response): Promise<T | null> {
  const text = await res.text();

  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function extractTrelloUrl(data: TrelloExportResult | null): string | null {
  if (!data) {
    return null;
  }

  const candidates = [data.url, data.boardUrl, data.link];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }

  return null;
}

function extractErrorMessage(data: TrelloExportResult | null, fallback: string): string {
  if (!data) {
    return fallback;
  }

  const candidates = [data.message, data.error, data.detail, data.title];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }

  return fallback;
}

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
    parseRoadmap(
      typeof (data as AddRoadmapResponse).id === "number"
        ? String((data as AddRoadmapResponse).id)
        : data.id,
      extractRoadmapSource(data),
      {
        id:
          typeof (data as AddRoadmapResponse).id === "string"
            ? (data as AddRoadmapResponse).id
            : typeof (data as AddRoadmapResponse).id === "number"
              ? String((data as AddRoadmapResponse).id)
              : undefined,
      }
    );

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
      parseRoadmap(id, extractRoadmapSource(data), {
        id:
          typeof (data as AddRoadmapResponse).id === "string"
            ? (data as AddRoadmapResponse).id
            : typeof (data as AddRoadmapResponse).id === "number"
              ? String((data as AddRoadmapResponse).id)
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

export async function getAllRoadmapsByUserId(userId: string): Promise<UserRoadmapEntry[]> {
  const existingRequest = allRoadmapsByUserIdRequests.get(userId);

  if (existingRequest) {
    return existingRequest;
  }

  const request = (async () => {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/roadmap/user/${userId}/all`,
      {
        method: "GET",
      }
    );

    if (res.status === 204 || res.status === 404) {
      return [];
    }

    if (!res.ok) {
      throw new Error("Could not fetch any roadmap.");
    }

    const data = await readJsonResponse<RoadmapCollectionResponse>(res);

    if (!data) {
      return [];
    }

    const normalizedEntries = normalizeUserRoadmapEntries(data);

    if (normalizedEntries.length === 0) {
      return [];
    }

    normalizedEntries.forEach((entry) => {
      cacheRoadmap(entry.roadmap);
    });

    return normalizedEntries;
  })().finally(() => {
    allRoadmapsByUserIdRequests.delete(userId);
  });

  allRoadmapsByUserIdRequests.set(userId, request);
  return request;
}

export async function getRoadmapByUserId(id: string): Promise<UserRoadmapEntry[]> {
  return getAllRoadmapsByUserId(id);
}

export async function exportRoadmapToTrello(
  roadmapId: string,
  roadmap?: Roadmap
): Promise<TrelloExportResult> {
  const endpointCandidates = [
    `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/roadmap/export/trello/${roadmapId}`,
  ];

  let lastError: Error | null = null;

  for (const endpoint of endpointCandidates) {
    const res = await fetchWithAuth(endpoint, {
      method: "POST",
      body: JSON.stringify({
        roadmapId,
        roadmap,
      }),
    });

    if (res.status === 404) {
      lastError = new Error(`Trello export endpoint not found: ${endpoint}`);
      continue;
    }

    const data = await readJsonResponse<TrelloExportResult>(res);

    if (!res.ok) {
      throw new Error(
        extractErrorMessage(
          data,
          `Could not export roadmap to Trello (HTTP ${res.status}).`
        )
      );
    }

    return {
      ...data,
      url: extractTrelloUrl(data) ?? undefined,
    };
  }

  throw lastError ?? new Error("Could not export roadmap to Trello.");
}

export function buildTrelloOAuthUrl(): string {
  const apiKey = process.env.NEXT_PUBLIC_TRELLO_API_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!apiKey) {
    throw new Error("Missing NEXT_PUBLIC_TRELLO_API_KEY for Trello authorization.");
  }

  const rawReturnUrl = appUrl && appUrl.length > 0 ? appUrl : window.location.origin;
  const returnUrl = new URL(rawReturnUrl).origin;
  const appName = process.env.NEXT_PUBLIC_TRELLO_APP_NAME ?? "RDMP";
  const url = new URL("https://api.trello.com/1/authorize");

  url.searchParams.set("response_type", "token");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("return_url", returnUrl);
  url.searchParams.set("callback_method", "postMessage");
  url.searchParams.set("scope", "read,write");
  url.searchParams.set("expiration", "never");
  url.searchParams.set("name", appName);

  return url.toString();
}

export async function saveTrelloConnection(token: string): Promise<TrelloConnectionResult> {
  const endpointCandidates = [
    `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/user/trello/connect`,
    `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/user/trello/callback/complete`,
    `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/user/trello/connection`,
  ];

  let lastError: Error | null = null;

  for (const endpoint of endpointCandidates) {
    const res = await fetchWithAuth(endpoint, {
      method: "POST",
      body: JSON.stringify({
        token,
      }),
    });

    if (res.status === 404) {
      lastError = new Error(`Trello connection endpoint not found: ${endpoint}`);
      continue;
    }

    const data = await readJsonResponse<TrelloConnectionResult>(res);

    if (!res.ok) {
      throw new Error(
        extractErrorMessage(
          data as TrelloExportResult | null,
          `Could not save Trello connection (HTTP ${res.status}).`
        )
      );
    }

    return data ?? { success: true };
  }

  throw lastError ?? new Error("Could not save Trello connection.");
}
