'use client';

import { Linkbar } from "@/components/linkbar";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);

  if (roadmap) {
    return (<main className="flex min-h-screen flex-col items-center gap-6 justify-center items-center p-24">
      <pre>{roadmap}</pre>
    </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 justify-center items-center p-24">
      {!isLoading ? (<><h1 className="text-3xl font-bold">Welcome to RDMP</h1> 
      <Linkbar setIsLoading={setIsLoading} setRoadmap={setRoadmap}/></>) : (<><Image
        src="/Loading_icon.gif"
        alt="Loading..."
        width={200}
        height={200}
      /></>)}
    </main>
  );
}
