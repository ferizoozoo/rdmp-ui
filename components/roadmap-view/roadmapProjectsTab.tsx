import { Roadmap } from '@/app/types/roadmap';
import { ResourceList } from './resourceList';
import { getRoadmapColor } from './constants';

type RoadmapProjectsTabProps = {
  roadmap: Roadmap;
  completedProjectSet: Set<string>;
  onToggleProject: (name: string) => void;
};

export function RoadmapProjectsTab({
  roadmap,
  completedProjectSet,
  onToggleProject,
}: RoadmapProjectsTabProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {roadmap.projects.map((project, index) => {
        const color = getRoadmapColor(index);
        const isCompleted = completedProjectSet.has(project.name);
        const appearsInMonth = roadmap.timeline.find((month) =>
          month.projectsToBuild.includes(project.name)
        )?.month;

        return (
          <div
            key={project.name}
            className={`flex flex-col gap-4 rounded-xl border bg-neutral-900/50 p-6 ${color.border}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h3
                  className={`text-base font-semibold ${
                    isCompleted ? 'text-emerald-100 line-through' : 'text-neutral-100'
                  }`}
                >
                  {project.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {appearsInMonth && (
                    <span
                      className={`flex-shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${color.light} ${color.text} ${color.border}`}
                    >
                      Month {appearsInMonth}
                    </span>
                  )}
                  {isCompleted && (
                    <span className="flex-shrink-0 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-300">
                      Completed
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onToggleProject(project.name)}
                className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                    : `${color.border} ${color.text} hover:border-orange-400/50 hover:text-orange-300`
                }`}
              >
                {isCompleted ? 'Undo' : 'Mark done'}
              </button>
            </div>

            <p
              className={`text-sm font-light leading-relaxed ${
                isCompleted ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            >
              {project.description}
            </p>

            <ResourceList resources={project.resources} accentTextClass={color.text} />
          </div>
        );
      })}
    </div>
  );
}
