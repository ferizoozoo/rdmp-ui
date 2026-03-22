'use client';
import { Linkbar } from "@/components/linkbar";
import RoadmapView from "@/components/roadmapView";
import { Roadmap } from "@/app/types/roadmap";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);

  if (roadmap) {
    return <RoadmapView key={roadmap.id || JSON.stringify(roadmap)} roadmap={roadmap} />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 justify-center p-24 bg-neutral-950 text-neutral-100">
      {!isLoading ? (
        <>
          <p className="text-xs tracking-[0.2em] uppercase text-neutral-500">
            Your Learning Path
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none text-center">
            Welcome to <span className="text-orange-500">RDMP</span>
          </h1>
          <p className="text-neutral-500 text-sm font-light">
            Paste job posting links to generate your personalized roadmap
          </p>
          <Linkbar setIsLoading={setIsLoading} setRoadmap={setRoadmap} />
        </>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-neutral-500 text-sm tracking-widest uppercase animate-pulse">
            Building your roadmap...
          </p>
        </div>
      )}
    </main>
  );
}
