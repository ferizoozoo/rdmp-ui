'use client';
import { Linkbar } from "@/components/linkbar";
import RoadmapView from "@/components/roadmapView";
import { parseRoadmap } from "@/app/lib/parseRoadmap";
import { Roadmap } from "@/app/types/roadmap";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [rawRoadmap, setRawRoadmap] = useState<string | null>(null);

  const roadmap: Roadmap | null = rawRoadmap ? parseRoadmap(rawRoadmap) : null;

  if (roadmap) {
    return <RoadmapView roadmap={roadmap} />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 justify-center p-24">
      {!isLoading ? (
        <>
          <h1 className="text-3xl font-bold">Welcome to RDMP</h1>
          <Linkbar setIsLoading={setIsLoading} setRoadmap={setRawRoadmap} />
        </>
      ) : (
        <Image
          src="/Loading_icon.gif"
          alt="Loading..."
          width={200}
          height={200}
        />
      )}
    </main>
  );
}
