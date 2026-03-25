'use client';

import { Suspense } from 'react';
import CurrentRoadmap from '@/components/currentRoadmap';

export default function RoadmapPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-neutral-100">
          <p className="text-sm uppercase tracking-widest text-neutral-500">Loading roadmap...</p>
        </main>
      }
    >
      <CurrentRoadmap />
    </Suspense>
  );
}
