'use client';

import { useEffect, useMemo, useState } from 'react';
import { Roadmap } from '@/app/types/roadmap';
import { CompletionState } from '@/app/types/roadmapView';
import {
  getRoadmapStorageKey,
  readCompletionState,
  toggleCompletionItem,
} from '@/app/lib/roadmap/utils';

export function useRoadmapCompletion(roadmap: Roadmap) {
  const storageKey = useMemo(() => getRoadmapStorageKey(roadmap), [roadmap]);
  const [completionState, setCompletionState] = useState<CompletionState>(() =>
    readCompletionState(storageKey)
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(completionState));
  }, [completionState, storageKey]);

  const completedSkillSet = useMemo(
    () => new Set(completionState.skills),
    [completionState.skills]
  );
  const completedProjectSet = useMemo(
    () => new Set(completionState.projects),
    [completionState.projects]
  );
  const completedItems = completionState.skills.length + completionState.projects.length;
  const totalItems = roadmap.skills.length + roadmap.projects.length;
  const completionPercent = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  function toggleSkill(name: string) {
    setCompletionState((current) => ({
      ...current,
      skills: toggleCompletionItem(current.skills, name),
    }));
  }

  function toggleProject(name: string) {
    setCompletionState((current) => ({
      ...current,
      projects: toggleCompletionItem(current.projects, name),
    }));
  }

  return {
    completedItems,
    totalItems,
    completionPercent,
    completedSkillSet,
    completedProjectSet,
    toggleSkill,
    toggleProject,
  };
}
