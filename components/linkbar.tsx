'use client';
import { addRoadmap } from "@/app/lib/services/roadmap.service";
import { Roadmap } from "@/app/types/roadmap";
import React, { useState } from "react";

type LinkbarProps = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onRoadmapCreated?: (roadmap: Roadmap) => void;
};

export const Linkbar = ({ setIsLoading, onRoadmapCreated }: LinkbarProps) => {
  const [inputMode, setInputMode] = useState<"links" | "text">("links");
  const [linksInput, setLinksInput] = useState<string>("");
  const [jobDescriptionInput, setJobDescriptionInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const splitLinks = linksInput.split("\n").map(link => link.trim()).filter(link => link !== "");
    const trimmedDescription = jobDescriptionInput.trim();

    if (inputMode === "links") {
      if (splitLinks.length === 0) {
        setError("Paste at least one direct job posting link.");
        return;
      }
    }

    if (inputMode === "text" && !trimmedDescription) {
      setError("Paste the job description text to generate a roadmap.");
      return;
    }

    setIsLoading(true);
    try {
      const roadmap = await addRoadmap(
        inputMode === "links"
          ? { links: splitLinks }
          : { jobDescription: trimmedDescription }
      );
      onRoadmapCreated?.(roadmap);
      setLinksInput("");
      setJobDescriptionInput("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-row items-center justify-start gap-6 p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInputMode("links")}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
              inputMode === "links"
                ? "border-orange-500/50 bg-orange-500/10 text-orange-300"
                : "border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
            }`}
          >
            Use Links
          </button>
          <button
            type="button"
            onClick={() => setInputMode("text")}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
              inputMode === "text"
                ? "border-orange-500/50 bg-orange-500/10 text-orange-300"
                : "border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
            }`}
          >
            Paste Text
          </button>
        </div>
        <div className="flex flex-row items-center gap-4">
          {inputMode === "links" ? (
            <textarea
              value={linksInput}
              rows={5}
              onChange={(e) => setLinksInput(e.target.value)}
              placeholder="Enter direct job posting links"
              className="bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-600
                         rounded-2xl px-5 py-3 w-[56rem] text-sm font-light leading-relaxed
                         focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20
                         transition-colors resize-none"
            />
          ) : (
            <textarea
              value={jobDescriptionInput}
              rows={10}
              onChange={(e) => setJobDescriptionInput(e.target.value)}
              placeholder="Paste the full job description here"
              className="bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-600
                         rounded-2xl px-5 py-3 w-[56rem] text-sm font-light leading-relaxed
                         focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20
                         transition-colors resize-none"
            />
          )}
          <button
            type="submit"
            className="border border-neutral-700 text-neutral-300 bg-transparent
                       hover:border-orange-500/50 hover:text-orange-400
                       rounded-2xl cursor-pointer px-6 py-3 text-sm font-semibold
                       tracking-widest uppercase transition-colors whitespace-nowrap"
          >
            Scrape
          </button>
        </div>
        <p className="text-xs text-neutral-500">
          {inputMode === "links"
            ? "Use the actual job-post page, not a search results page."
            : "Manual text is the best fallback when job boards block scraping or require login."}
        </p>
        {error && (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};
