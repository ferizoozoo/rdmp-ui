'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cacheRoadmap, getUserIdFromToken, RoadmapHistoryEntry } from '@/app/lib/roadmap/utils';
import { getAllRoadmapsByUserId } from '@/app/lib/services/roadmap.service';
import { Linkbar } from '@/components/linkbar';
import useUser from '@/app/hooks/useUser';

function inferRoadmapTitle(entry: { roadmap: { id: string; projects: { name: string }[]; skills: { name: string }[] } }) {
  const primaryProject = entry.roadmap.projects[0]?.name;
  const primarySkill = entry.roadmap.skills[0]?.name;

  return primaryProject ?? primarySkill ?? `Roadmap ${entry.roadmap.id}`;
}

function inferRoadmapSummary(entry: { roadmap: { skills: unknown[]; projects: unknown[]; timeline: unknown[] } }) {
  const parts = [
    entry.roadmap.skills.length > 0 ? `${entry.roadmap.skills.length} skills` : null,
    entry.roadmap.projects.length > 0 ? `${entry.roadmap.projects.length} projects` : null,
    entry.roadmap.timeline.length > 0 ? `${entry.roadmap.timeline.length} months` : null,
  ].filter(Boolean);

  return parts.join(' • ') || 'Saved roadmap';
}

export default function RoadmapFlow() {
  const router = useRouter();
  const { token } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [remoteHistory, setRemoteHistory] = useState<RoadmapHistoryEntry[]>([]);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const userId = useMemo(() => {
    if (!token) {
      return null;
    }

    return getUserIdFromToken(token);
  }, [token]);
  const history = userId ? remoteHistory : [];

  useEffect(() => {
    if (!userId) {
      return;
    }

    let isCancelled = false;

    async function loadRoadmaps() {
      try {
        setHistoryError(null);
        const roadmaps = await getAllRoadmapsByUserId(userId);

        if (isCancelled) {
          return;
        }

        setRemoteHistory(
          roadmaps.map((entry) => ({
            id: entry.roadmap.id,
            title: inferRoadmapTitle(entry),
            summary: inferRoadmapSummary(entry),
            createdAt: entry.createdAt,
            roadmap: entry.roadmap,
          }))
        );
      } catch {
        if (!isCancelled) {
          setHistoryError('Could not load your saved roadmaps.');
        }
      }
    }

    loadRoadmaps();

    return () => {
      isCancelled = true;
    };
  }, [userId]);

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-10 overflow-hidden bg-neutral-950 px-24 pb-24 pt-32 text-neutral-100">
      {!isLoading ? (
        <>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Your Learning Path</p>
          <h1 className="text-center text-5xl font-black leading-none tracking-tight md:text-7xl">
            Welcome to <span className="text-orange-500">RDMP</span>
          </h1>
          <p className="text-sm font-light text-neutral-500">
            Paste job posting links to generate your personalized roadmap
          </p>
          <Linkbar
            setIsLoading={setIsLoading}
            onRoadmapCreated={(roadmap) => {
              cacheRoadmap(roadmap);
              setRemoteHistory((currentHistory) => [
                {
                  id: roadmap.id,
                  title: inferRoadmapTitle({ roadmap }),
                  summary: inferRoadmapSummary({ roadmap }),
                  createdAt: new Date().toISOString(),
                  roadmap,
                },
                ...currentHistory.filter((entry) => entry.id !== roadmap.id),
              ]);
              router.push(`/roadmap?id=${encodeURIComponent(roadmap.id)}`);
            }}
          />
          {userId && historyError && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {historyError}
            </p>
          )}
          {history.length > 0 && (
            <section className="flex max-h-[26rem] w-full max-w-5xl flex-col rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Previous Roadmaps</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-neutral-100">
                    Continue where you left off
                  </h2>
                </div>
              </div>
              <div className="grid flex-1 gap-3 overflow-y-auto pr-2 md:grid-cols-2">
                {history.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/roadmap?id=${encodeURIComponent(entry.id)}`}
                    className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 transition-colors hover:border-orange-500/40 hover:bg-neutral-900"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                      Roadmap #{entry.id}
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-neutral-100">{entry.title}</h3>
                    <p className="mt-1 text-sm text-neutral-400">{entry.summary}</p>
                    <p className="mt-3 text-xs text-neutral-600">
                      Saved {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="animate-pulse text-sm uppercase tracking-widest text-neutral-500">
            Building your roadmap...
          </p>
        </div>
      )}
    </main>
  );
}
