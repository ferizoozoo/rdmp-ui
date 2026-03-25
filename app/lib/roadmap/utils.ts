import { jwtDecode } from 'jwt-decode';
import { Roadmap } from '@/app/types/roadmap';
import { CompletionState } from '@/app/types/roadmapView';

export type RoadmapHistoryEntry = {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  roadmap: Roadmap;
};

export function toggleCompletionItem(items: string[], name: string) {
  return items.includes(name)
    ? items.filter((item) => item !== name)
    : [...items, name];
}

export function getRoadmapStorageKey(roadmap: Roadmap) {
  return `rdmp-progress:${JSON.stringify(roadmap)}`;
}

function getRoadmapCacheKey(id: string) {
  return `rdmp-roadmap:${id}`;
}

function getRoadmapHistoryKey(userId: string) {
  return `rdmp-roadmap-history:${userId}`;
}

function inferRoadmapTitle(roadmap: Roadmap) {
  const primaryProject = roadmap.projects[0]?.name;
  const primarySkill = roadmap.skills[0]?.name;

  return primaryProject ?? primarySkill ?? `Roadmap ${roadmap.id}`;
}

function inferRoadmapSummary(roadmap: Roadmap) {
  const parts = [
    roadmap.skills.length > 0 ? `${roadmap.skills.length} skills` : null,
    roadmap.projects.length > 0 ? `${roadmap.projects.length} projects` : null,
    roadmap.timeline.length > 0 ? `${roadmap.timeline.length} months` : null,
  ].filter(Boolean);

  return parts.join(' • ') || 'Saved roadmap';
}

export function cacheRoadmap(roadmap: Roadmap) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    sessionStorage.setItem(getRoadmapCacheKey(roadmap.id), JSON.stringify(roadmap));
    saveRoadmapToHistory(roadmap);
  } catch (err) {
    console.error('Failed to cache roadmap:', err);
  }
}

export function saveRoadmapToHistory(roadmap: Roadmap) {
  if (typeof window === 'undefined') {
    return;
  }

  const token = localStorage.getItem('accessToken');

  if (!token) {
    return;
  }

  const userId = getUserIdFromToken(token);

  if (!userId) {
    return;
  }

  try {
    const storageKey = getRoadmapHistoryKey(userId);
    const existingEntries = readRoadmapHistory(userId);
    const nextEntry: RoadmapHistoryEntry = {
      id: roadmap.id,
      title: inferRoadmapTitle(roadmap),
      summary: inferRoadmapSummary(roadmap),
      createdAt: new Date().toISOString(),
      roadmap,
    };
    const updatedEntries = [
      nextEntry,
      ...existingEntries.filter((entry) => entry.id !== roadmap.id),
    ].slice(0, 12);

    localStorage.setItem(storageKey, JSON.stringify(updatedEntries));
  } catch (err) {
    console.error('Failed to save roadmap history:', err);
  }
}

export function readRoadmapHistory(userId: string) {
  if (typeof window === 'undefined') {
    return [] as RoadmapHistoryEntry[];
  }

  try {
    const stored = localStorage.getItem(getRoadmapHistoryKey(userId));

    if (!stored) {
      return [] as RoadmapHistoryEntry[];
    }

    const parsed = JSON.parse(stored) as RoadmapHistoryEntry[];

    return parsed
      .map((entry) => {
        const roadmap = parseRoadmap(entry.id, entry.roadmap ?? entry, { id: entry.id });

        if (!roadmap) {
          return null;
        }

        return {
          id: roadmap.id,
          title: entry.title ?? inferRoadmapTitle(roadmap),
          summary: entry.summary ?? inferRoadmapSummary(roadmap),
          createdAt: entry.createdAt ?? new Date().toISOString(),
          roadmap,
        };
      })
      .filter((entry): entry is RoadmapHistoryEntry => entry !== null);
  } catch (err) {
    console.error('Failed to read roadmap history:', err);
    return [] as RoadmapHistoryEntry[];
  }
}

export function readCachedRoadmap(id: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = sessionStorage.getItem(getRoadmapCacheKey(id));

    if (!stored) {
      return null;
    }

    return parseRoadmap(id, stored, { id });
  } catch (err) {
    console.error('Failed to read cached roadmap:', err);
    return null;
  }
}

export function readCompletionState(storageKey: string): CompletionState {
  const emptyState: CompletionState = { skills: [], projects: [] };

  if (typeof window === 'undefined') {
    return emptyState;
  }

  const stored = localStorage.getItem(storageKey);

  if (!stored) {
    return emptyState;
  }

  try {
    const parsed = JSON.parse(stored) as CompletionState;
    return {
      skills: parsed.skills ?? [],
      projects: parsed.projects ?? [],
    };
  } catch {
    return emptyState;
  }
}

export function getUserIdFromToken(token: string) {
  const decoded = jwtDecode<{ sub?: string; userId?: string; id?: string }>(token);
  return decoded.userId ?? decoded.sub ?? decoded.id ?? null;
}

function parseJsonLike<T = unknown>(value: unknown): T | unknown {
  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(
      value
        .trim()
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
    ) as T;
  } catch {
    return value;
  }
}

function parseJsonRecursively<T = unknown>(value: unknown, maxDepth = 3): T | unknown {
  let currentValue = value;

  for (let depth = 0; depth < maxDepth; depth += 1) {
    const nextValue = parseJsonLike<T>(currentValue);

    if (nextValue === currentValue) {
      return currentValue;
    }

    currentValue = nextValue;
  }

  return currentValue;
}

function normalizeStringArray(value: unknown): string[] {
  const parsedValue = parseJsonRecursively(value);

  if (Array.isArray(parsedValue)) {
    return parsedValue
      .map((item) => {
        if (typeof item === 'string') {
          return item.trim();
        }

        if (item && typeof item === 'object') {
          const record = item as Record<string, unknown>;
          const text = record.name ?? record.title ?? record.url ?? record.link;
          return typeof text === 'string' ? text.trim() : '';
        }

        return '';
      })
      .filter(Boolean);
  }

  if (typeof parsedValue === 'string') {
    return parsedValue
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeCollection(value: unknown): unknown[] {
  const parsedValue = parseJsonRecursively(value);

  if (Array.isArray(parsedValue)) {
    return parsedValue;
  }

  if (!parsedValue || typeof parsedValue !== 'object') {
    return [];
  }

  return Object.entries(parsedValue as Record<string, unknown>).map(([key, item]) => {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      return item;
    }

    return {
      name: key,
      value: item,
    };
  });
}

function normalizeRoadmapItem(
  value: unknown,
  fallbackNamePrefix: string,
  index: number
): { name: string; description: string; resources: string[] } | null {
  const parsedValue = parseJsonLike(value);
  const normalizedValue = parseJsonRecursively(parsedValue);

  if (typeof normalizedValue === 'string') {
    const name = normalizedValue.trim();

    return name
      ? {
          name,
          description: '',
          resources: [],
        }
      : null;
  }

  if (!normalizedValue || typeof normalizedValue !== 'object') {
    return null;
  }

  const record = normalizedValue as Record<string, unknown>;
  const nameSource = record.name ?? record.title ?? record.skill ?? record.project;
  const descriptionSource =
    record.description ?? record.summary ?? record.details ?? record.reason ?? record.value;

  const name =
    typeof nameSource === 'string' && nameSource.trim()
      ? nameSource.trim()
      : `${fallbackNamePrefix} ${index + 1}`;

  return {
    name,
    description: typeof descriptionSource === 'string' ? descriptionSource.trim() : '',
    resources: normalizeStringArray(record.resources ?? record.links ?? record.references),
  };
}

function normalizeTimelineItem(value: unknown, index: number) {
  const parsedValue = parseJsonRecursively(value);

  if (typeof parsedValue === 'string') {
    return {
      month: index + 1,
      skillsToLearn: [],
      projectsToBuild: [parsedValue.trim()].filter(Boolean),
    };
  }

  if (!parsedValue || typeof parsedValue !== 'object') {
    return null;
  }

  const record = parsedValue as Record<string, unknown>;
  const monthSource =
    record.month ?? record.monthNumber ?? record.month_number ?? record.order ?? record.index;
  const month =
    typeof monthSource === 'number'
      ? monthSource
      : typeof monthSource === 'string'
        ? Number.parseInt(monthSource, 10)
        : index + 1;

  return {
    month: Number.isFinite(month) ? month : index + 1,
    skillsToLearn: normalizeStringArray(
      record.skillsToLearn ??
        record.skills_to_learn ??
        record.skills ??
        record.skillsLearned ??
        record.skills_learned
    ),
    projectsToBuild: normalizeStringArray(
      record.projectsToBuild ??
        record.projects_to_build ??
        record.projects ??
        record.project ??
        record.deliverables
    ),
  };
}

function unwrapRoadmapCandidate(value: unknown): unknown {
  function isRoadmapLike(candidate: unknown) {
    if (!candidate || typeof candidate !== 'object') {
      return false;
    }

    const record = candidate as Record<string, unknown>;

    return (
      ('skills' in record || 'skill' in record || 'skillset' in record) &&
      ('projects' in record || 'project' in record || 'portfolio' in record) &&
      ('timeline' in record || 'months' in record || 'plan' in record || 'milestones' in record)
    );
  }

  function findRoadmapCandidate(candidate: unknown, depth = 0): unknown {
    const parsedCandidate = parseJsonRecursively(candidate);

    if (isRoadmapLike(parsedCandidate) || depth >= 5) {
      return parsedCandidate;
    }

    if (!parsedCandidate || typeof parsedCandidate !== 'object') {
      return parsedCandidate;
    }

    if (Array.isArray(parsedCandidate)) {
      for (const item of parsedCandidate) {
        const nestedCandidate = findRoadmapCandidate(item, depth + 1);

        if (isRoadmapLike(nestedCandidate)) {
          return nestedCandidate;
        }
      }

      return parsedCandidate;
    }

    const record = parsedCandidate as Record<string, unknown>;

    for (const value of Object.values(record)) {
      const nestedCandidate = findRoadmapCandidate(value, depth + 1);

      if (isRoadmapLike(nestedCandidate)) {
        return nestedCandidate;
      }
    }

    return parsedCandidate;
  }

  return findRoadmapCandidate(value);
}

function normalizeRoadmap(value: unknown): Omit<Roadmap, 'id'> | null {
  const candidate = unwrapRoadmapCandidate(value);

  if (!candidate || typeof candidate !== 'object') {
    return null;
  }

  const record = candidate as Record<string, unknown>;
  const skillsSource = normalizeCollection(record.skills ?? record.skill ?? record.skillset);
  const projectsSource = normalizeCollection(record.projects ?? record.project ?? record.portfolio);
  const timelineSource = normalizeCollection(
    record.timeline ?? record.months ?? record.plan ?? record.milestones
  );

  const timeline = timelineSource
    .map((item, index) => normalizeTimelineItem(item, index))
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const timelineSkillNames = Array.from(
    new Set(timeline.flatMap((item) => item.skillsToLearn).filter(Boolean))
  );
  const timelineProjectNames = Array.from(
    new Set(timeline.flatMap((item) => item.projectsToBuild).filter(Boolean))
  );

  const skills = skillsSource
    .map((item, index) => normalizeRoadmapItem(item, 'Skill', index))
    .filter((item): item is NonNullable<typeof item> => item !== null);
  const projects = projectsSource
    .map((item, index) => normalizeRoadmapItem(item, 'Project', index))
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const normalizedSkills =
    skills.length > 0
      ? skills
      : timelineSkillNames.map((name) => ({
          name,
          description: '',
          resources: [],
        }));

  const normalizedProjects =
    projects.length > 0
      ? projects
      : timelineProjectNames.map((name) => ({
          name,
          description: '',
          resources: [],
        }));

  if (
    normalizedSkills.length === 0 &&
    normalizedProjects.length === 0 &&
    timeline.length === 0
  ) {
    return null;
  }

  return {
    skills: normalizedSkills,
    projects: normalizedProjects,
    timeline,
  };
}

function summarizeRoadmapPayload(value: unknown, depth = 0): unknown {
  if (depth > 2) {
    return '[max-depth]';
  }

  const parsedValue = parseJsonRecursively(value);

  if (Array.isArray(parsedValue)) {
    return {
      type: 'array',
      length: parsedValue.length,
      firstItem: summarizeRoadmapPayload(parsedValue[0], depth + 1),
    };
  }

  if (!parsedValue || typeof parsedValue !== 'object') {
    return parsedValue;
  }

  const record = parsedValue as Record<string, unknown>;

  return Object.fromEntries(
    Object.entries(record).map(([key, entryValue]) => {
      if (Array.isArray(entryValue)) {
        return [
          key,
          {
            type: 'array',
            length: entryValue.length,
            firstItem: summarizeRoadmapPayload(entryValue[0], depth + 1),
          },
        ];
      }

      if (entryValue && typeof entryValue === 'object') {
        return [key, summarizeRoadmapPayload(entryValue, depth + 1)];
      }

      return [key, typeof entryValue];
    })
  );
}

type ParseRoadmapOptions = {
  id?: string;
};

export function parseRoadmap(id: string | unknown, raw: string | unknown, options: ParseRoadmapOptions = {}): Roadmap | null {
  try {
    const parsed = normalizeRoadmap(raw);

    if (!parsed) {
      throw new Error('Missing required fields');
    }

    const roadmapIdSource = options.id ?? (typeof id === 'string' || typeof id === 'number' ? id : null);

    if (!roadmapIdSource) {
      throw new Error('Roadmap id is missing');
    }

    const roadmapId = roadmapIdSource.toString();
      

    return {
      ...parsed,
      id: roadmapId,
    };
  } catch (err) {
    console.error('Failed to parse roadmap JSON:', err, summarizeRoadmapPayload(raw));
    return null;
  }
}
