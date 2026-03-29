type RoadmapHeroProps = {
  monthCount: number;
  skillCount: number;
  projectCount: number;
  completedItems: number;
  totalItems: number;
  completionPercent: number;
  onExportToTrello: () => void;
  isExportingToTrello: boolean;
  trelloExportMessage: string | null;
  trelloExportError: string | null;
};

export function RoadmapHero({
  monthCount,
  skillCount,
  projectCount,
  completedItems,
  totalItems,
  completionPercent,
  onExportToTrello,
  isExportingToTrello,
  trelloExportMessage,
  trelloExportError,
}: RoadmapHeroProps) {
  return (
    <div className="relative overflow-hidden border-b border-neutral-800 px-6 pb-12 pt-20 md:px-12">
      <div className="pointer-events-none absolute right-0 top-0 select-none text-[180px] font-black leading-none tracking-tighter text-neutral-900">
        RDMP
      </div>
      <div className="relative z-10 max-w-4xl">
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
      </div>

      <div className="relative z-10 mt-8 max-w-3xl rounded-[2rem] border border-sky-500/25 bg-gradient-to-r from-sky-500/16 via-sky-400/10 to-neutral-900/80 p-5 shadow-[0_0_0_1px_rgba(56,189,248,0.08)] backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-300/80">
              Next Step
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              Send this roadmap to Trello and turn it into a board your team can use.
            </p>
          </div>

          <button
            type="button"
            onClick={onExportToTrello}
            disabled={isExportingToTrello}
            className="w-full rounded-full border border-sky-300/60 bg-sky-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950 transition-colors hover:border-white hover:bg-sky-300 disabled:cursor-not-allowed disabled:border-neutral-700 disabled:bg-neutral-800 disabled:text-neutral-500 md:w-auto"
          >
            {isExportingToTrello ? 'Exporting...' : 'Export to Trello'}
          </button>
        </div>

        {trelloExportMessage ? (
          <p className="mt-3 text-sm text-emerald-400">{trelloExportMessage}</p>
        ) : null}

        {trelloExportError ? (
          <p className="mt-3 text-sm text-red-400">{trelloExportError}</p>
        ) : null}
      </div>

      <div className="relative z-10 mt-8 max-w-md">
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
