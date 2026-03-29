'use client';

import { useMemo, useState } from 'react';
import {
  buildTrelloOAuthUrl,
  exportRoadmapToTrello,
  saveTrelloConnection,
} from '@/app/lib/services/roadmap.service';
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
  const [isExportingToTrello, setIsExportingToTrello] = useState(false);
  const [trelloExportMessage, setTrelloExportMessage] = useState<string | null>(null);
  const [trelloExportError, setTrelloExportError] = useState<string | null>(null);
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

  function connectToTrelloWithPopup() {
    const popup = window.open(
      buildTrelloOAuthUrl(),
      'trello-oauth',
      'width=720,height=760,menubar=no,toolbar=no,status=no,scrollbars=yes'
    );

    if (!popup) {
      return Promise.reject(new Error('Popup blocked. Allow popups and try again.'));
    }

    return new Promise<string>((resolve, reject) => {
      const allowedOrigins = new Set<string>(['https://trello.com', 'https://api.trello.com']);

      const cleanup = () => {
        window.removeEventListener('message', handleMessage);
        window.clearInterval(closeWatcher);
      };

      const handleMessage = (event: MessageEvent) => {
        if (!allowedOrigins.has(event.origin)) {
          return;
        }

        cleanup();
        popup.close();

        if (typeof event.data === 'string' && event.data.trim().length > 0) {
          if (event.data.toLowerCase().includes('error') || event.data.toLowerCase().includes('denied')) {
            reject(new Error(event.data));
            return;
          }

          resolve(event.data);
          return;
        }

        reject(new Error('Trello connection did not return a token.'));
      };

      const closeWatcher = window.setInterval(() => {
        if (!popup.closed) {
          return;
        }

        cleanup();
        reject(new Error('Trello connection window was closed before finishing.'));
      }, 400);

      window.addEventListener('message', handleMessage);
    });
  }

  async function handleExportToTrello() {
    setIsExportingToTrello(true);
    setTrelloExportMessage(null);
    setTrelloExportError(null);

    try {
      const trelloToken = await connectToTrelloWithPopup();
      const connectionResult = await saveTrelloConnection(trelloToken);

      if (connectionResult.success === false) {
        throw new Error(connectionResult.message || 'Could not save Trello connection.');
      }

      const finalResult = await exportRoadmapToTrello(roadmap.id, roadmap);

      const trelloUrl =
        typeof finalResult.url === 'string' && finalResult.url.trim().length > 0
          ? finalResult.url
          : null;

      setTrelloExportMessage(
        typeof finalResult.message === 'string' && finalResult.message.trim().length > 0
          ? finalResult.message
          : trelloUrl
            ? 'Roadmap exported to Trello. Opening board...'
            : 'Roadmap exported to Trello.'
      );

      if (trelloUrl) {
        window.open(trelloUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error(error);
      setTrelloExportError(
        error instanceof Error && error.message.trim().length > 0
          ? error.message
          : 'Could not export this roadmap to Trello.'
      );
    } finally {
      setIsExportingToTrello(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <RoadmapHero
        monthCount={roadmap.timeline.length}
        skillCount={roadmap.skills.length}
        projectCount={roadmap.projects.length}
        completedItems={completedItems}
        totalItems={totalItems}
        completionPercent={completionPercent}
        onExportToTrello={handleExportToTrello}
        isExportingToTrello={isExportingToTrello}
        trelloExportMessage={trelloExportMessage}
        trelloExportError={trelloExportError}
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
