'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getRoadmapById } from '@/app/lib/services/roadmap.service';
import { readCachedRoadmap } from '@/app/lib/roadmap/utils';
import { Roadmap } from '@/app/types/roadmap';
import RoadmapView from '@/components/roadmapView';

export default function CurrentRoadmap() {
  const searchParams = useSearchParams();
  const roadmapId = searchParams.get('id');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadRoadmap() {
      if (!roadmapId) {
        if (!isCancelled) {
          setRoadmap(null);
          setError('missing-roadmap-id');
          setIsLoading(false);
        }
        return;
      }

      const cachedRoadmap = readCachedRoadmap(roadmapId);
      const hasCachedRoadmap = cachedRoadmap !== null;

      if (hasCachedRoadmap && !isCancelled) {
        setRoadmap(cachedRoadmap);
        setError(null);
        setIsLoading(false);
      }

      if (!hasCachedRoadmap) {
        setIsLoading(true);
      }
      setError(null);

      try {
        const nextRoadmap = await getRoadmapById(roadmapId);

        if (!isCancelled) {
          setRoadmap(nextRoadmap);
          setError(null);
        }
      } catch (loadError) {
        if (!isCancelled) {
          console.error(loadError);
          if (!hasCachedRoadmap) {
            setRoadmap(null);
            setError('roadmap-load-failed');
          }
        }
      } finally {
        if (!isCancelled && !hasCachedRoadmap) {
          setIsLoading(false);
        }
      }
    }

    void loadRoadmap();

    return () => {
      isCancelled = true;
    };
  }, [roadmapId]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-neutral-100">
        <p className="text-sm uppercase tracking-widest text-neutral-500">Loading roadmap...</p>
      </main>
    );
  }

  if (!roadmap) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-950 px-6 text-center text-neutral-100">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          {error === 'missing-roadmap-id' ? 'Missing Roadmap' : 'Roadmap Unavailable'}
        </p>
        <h1 className="text-4xl font-black tracking-tight md:text-5xl">
          {error === 'missing-roadmap-id' ? 'Pick a roadmap first' : 'We could not load this roadmap'}
        </h1>
        <p className="max-w-xl text-sm text-neutral-500">
          {error === 'missing-roadmap-id'
            ? 'Start from the homepage, paste your job posting links, and we will send you to the generated roadmap.'
            : 'Try generating the roadmap again from the homepage.'}
        </p>
        <Link
          href="/"
          className="rounded-2xl border border-neutral-700 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-neutral-300 transition-colors hover:border-orange-500/50 hover:text-orange-400"
        >
          Go to Home
        </Link>
      </main>
    );
  }

  return <RoadmapView key={roadmap.id || JSON.stringify(roadmap)} roadmap={roadmap} />;
}
