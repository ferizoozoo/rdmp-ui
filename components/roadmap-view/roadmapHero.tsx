type RoadmapHeroProps = {
  monthCount: number;
  skillCount: number;
  projectCount: number;
  completedItems: number;
  totalItems: number;
  completionPercent: number;
};

export function RoadmapHero({
  monthCount,
  skillCount,
  projectCount,
  completedItems,
  totalItems,
  completionPercent,
}: RoadmapHeroProps) {
  return (
    <div className="relative overflow-hidden border-b border-neutral-800 px-6 pb-12 pt-20 md:px-12">
      <div className="pointer-events-none absolute right-0 top-0 select-none text-[180px] font-black leading-none tracking-tighter text-neutral-900">
        RDMP
      </div>
      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-neutral-500">
        Your Learning Path
      </p>
      <h1 className="mb-4 text-5xl font-black leading-none tracking-tight md:text-7xl">
        <span className="text-orange-500">{monthCount}-Month</span>
        <br />
        Roadmap
      </h1>
      <p className="max-w-md text-sm font-light leading-relaxed text-neutral-400">
        {skillCount} skills · {projectCount} projects · {monthCount} months
      </p>

      <div className="mt-8 max-w-md">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-neutral-500">
          <span>Progress</span>
          <span>{completedItems}/{totalItems} completed</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-900">
          <div
            className="h-full rounded-full bg-orange-500 transition-all duration-300"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
