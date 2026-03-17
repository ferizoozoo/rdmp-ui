'use client';
import { addRoadmap } from "@/app/lib/services/roadmap.service";
import React, { useState } from "react";

export const Linkbar = ({ setIsLoading, setRoadmap }: { setIsLoading: React.Dispatch<React.SetStateAction<boolean>>; setRoadmap: React.Dispatch<React.SetStateAction<any>> }) => {
  const [links, setLinks] = useState<string[]>([]);
  const [linksInput, setLinksInput] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    const splitLinks = linksInput.split("\n").map(link => link.trim()).filter(link => link !== "");
    setLinks(splitLinks);
    const res = await addRoadmap(splitLinks); 
    setRoadmap(res.roadmap);
    setLinks([]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-row items-center justify-start gap-6 p-4">
      <form onSubmit={handleSubmit} className="flex flex-row items-center gap-4">
        <textarea
          value={linksInput}
          rows={5}
          onChange={(e) => setLinksInput(e.target.value)}
          placeholder="Enter all the job posting links"
          className="bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-600
                     rounded-2xl px-5 py-3 w-[56rem] text-sm font-light leading-relaxed
                     focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20
                     transition-colors resize-none"
        />
        <button
          type="submit"
          className="border border-neutral-700 text-neutral-300 bg-transparent
                     hover:border-orange-500/50 hover:text-orange-400
                     rounded-2xl cursor-pointer px-6 py-3 text-sm font-semibold
                     tracking-widest uppercase transition-colors whitespace-nowrap"
        >
          Scrape
        </button>
      </form>
    </div>
  );
};