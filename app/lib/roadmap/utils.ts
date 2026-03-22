import { jwtDecode } from 'jwt-decode';
import { Roadmap } from '@/app/types/roadmap';
import { CompletionState } from '@/app/types/roadmapView';

export function toggleCompletionItem(items: string[], name: string) {
  return items.includes(name)
    ? items.filter((item) => item !== name)
    : [...items, name];
}

export function getRoadmapStorageKey(roadmap: Roadmap) {
  return `rdmp-progress:${JSON.stringify(roadmap)}`;
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
