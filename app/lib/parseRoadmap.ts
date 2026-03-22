import { Roadmap } from '@/app/types/roadmap';

function isRoadmap(value: unknown): value is Omit<Roadmap, 'id'> & Partial<Pick<Roadmap, 'id'>> {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    Array.isArray(candidate.skills) &&
    Array.isArray(candidate.projects) &&
    Array.isArray(candidate.timeline)
  );
}

type ParseRoadmapOptions = {
  id?: string;
};

export function parseRoadmap(id: string | unknown, raw: string | unknown, options: ParseRoadmapOptions = {}): Roadmap | null {
  try {
    const parsed =
      typeof raw === 'string'
        ? JSON.parse(
            raw
              .trim()
              .replace(/^```json\s*/i, '')
              .replace(/^```\s*/i, '')
              .replace(/```$/i, '')
          )
        : raw;

    if (!isRoadmap(parsed)) {
      throw new Error('Missing required fields');
    }

    const roadmapIdSource = options.id ?? (typeof id === 'string' || typeof id === 'number' ? id : null);

    if (!roadmapIdSource) {
      throw new Error('Roadmap id is missing');
    }

    const roadmapId = roadmapIdSource.toString();
      

    return {
      ...(parsed as Omit<Roadmap, 'id'>),
      id: roadmapId,
    };
  } catch (err) {
    console.error('Failed to parse roadmap JSON:', err);
    return null;
  }
}
