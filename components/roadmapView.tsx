'use client';

import { useMemo, useState } from 'react';
import { useRoadmapCompletion } from '@/app/hooks/useRoadmapCompletion';
import { Roadmap } from '@/app/types/roadmap';
import { Tab } from '@/app/types/roadmapView';
import { RoadmapHero } from './roadmap-view/roadmapHero';
import { RoadmapProjectsTab } from './roadmap-view/roadmapProjectsTab';
import { RoadmapSkillsTab } from './roadmap-view/roadmapSkillsTab';
import { RoadmapTimelineTab } from './roadmap-view/roadmapTimelineTab';
import { TabNavigation } from './roadmap-view/tabNavigation';

export default function RoadmapView({ roadmap }: { roadmap: Roadmap }) {
  const [activeTab, setActiveTab] = useState<Tab>('timeline');
  const {
    completedItems,
    totalItems,
    completionPercent,
    completedSkillSet,
    completedProjectSet,
    toggleSkill,
    toggleProject,
  } = useRoadmapCompletion(roadmap);

  const projectMap = useMemo(
    () => Object.fromEntries(roadmap.projects.map((project) => [project.name, project])),
    [roadmap.projects]
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <RoadmapHero
        monthCount={roadmap.timeline.length}
        skillCount={roadmap.skills.length}
        projectCount={roadmap.projects.length}
        completedItems={completedItems}
        totalItems={totalItems}
        completionPercent={completionPercent}
      />

      <TabNavigation activeTab={activeTab} onSelectTab={setActiveTab} />

      <div className="px-6 py-12 md:px-12">
        {activeTab === 'timeline' && (
          <RoadmapTimelineTab
            roadmap={roadmap}
            completedSkillSet={completedSkillSet}
            completedProjectSet={completedProjectSet}
            projectMap={projectMap}
            onToggleSkill={toggleSkill}
            onToggleProject={toggleProject}
          />
        )}

        {activeTab === 'skills' && (
          <RoadmapSkillsTab
            roadmap={roadmap}
            completedSkillSet={completedSkillSet}
            onToggleSkill={toggleSkill}
          />
        )}

        {activeTab === 'projects' && (
          <RoadmapProjectsTab
            roadmap={roadmap}
            completedProjectSet={completedProjectSet}
            onToggleProject={toggleProject}
          />
        )}
      </div>
    </div>
  );
}
