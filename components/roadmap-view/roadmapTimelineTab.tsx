import { Roadmap, RoadmapProject } from '@/app/types/roadmap';
import { getRoadmapColor } from './constants';

type RoadmapTimelineTabProps = {
  roadmap: Roadmap;
  completedSkillSet: Set<string>;
  completedProjectSet: Set<string>;
  projectMap: Record<string, RoadmapProject>;
  onToggleSkill: (name: string) => void;
  onToggleProject: (name: string) => void;
};

export function RoadmapTimelineTab({
  roadmap,
  completedSkillSet,
  completedProjectSet,
  projectMap,
  onToggleSkill,
  onToggleProject,
}: RoadmapTimelineTabProps) {
  return (
    <div className="relative">
      <div className="absolute bottom-0 left-5 top-0 w-px bg-neutral-800" />
      <div className="flex flex-col">
        {roadmap.timeline.map((item, index) => {
          const color = getRoadmapColor(index);

          return (
            <div key={item.month} className="relative flex gap-8 pb-10 last:pb-0">
              <div className="z-10 flex-shrink-0">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-black text-neutral-950 ${color.accent}`}
                >
                  {item.month}
                </div>
              </div>
              <div
                className={`flex flex-1 flex-col gap-4 rounded-xl border bg-neutral-900/50 p-5 ${color.border}`}
              >
                <p className={`text-xs font-semibold uppercase tracking-widest ${color.text}`}>
                  Month {item.month}
                </p>

                {item.skillsToLearn.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-widest text-neutral-500">
                      Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.skillsToLearn.map((name) => {
                        const isCompleted = completedSkillSet.has(name);

                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => onToggleSkill(name)}
                            aria-pressed={isCompleted}
                            className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                              isCompleted
                                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300 line-through'
                                : `${color.light} ${color.text} ${color.border} hover:border-orange-400/50`
                            }`}
                          >
                            {isCompleted ? `Done · ${name}` : name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {item.projectsToBuild.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-widest text-neutral-500">
                      Projects
                    </p>
                    <div className="flex flex-col gap-1">
                      {item.projectsToBuild.map((name) => {
                        const project = projectMap[name];
                        const isCompleted = completedProjectSet.has(name);

                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => onToggleProject(name)}
                            aria-pressed={isCompleted}
                            className={`-mx-2 flex items-start gap-2 rounded-lg px-2 py-1.5 text-left transition-colors ${
                              isCompleted ? 'bg-emerald-500/10' : 'hover:bg-neutral-800/70'
                            }`}
                          >
                            <span
                              className={`mt-0.5 text-xs ${
                                isCompleted ? 'text-emerald-400' : 'text-neutral-600'
                              }`}
                            >
                              {isCompleted ? '✓' : '→'}
                            </span>
                            <div>
                              <p
                                className={`text-sm ${
                                  isCompleted
                                    ? 'text-emerald-200 line-through'
                                    : 'text-neutral-200'
                                }`}
                              >
                                {name}
                              </p>
                              {project && (
                                <p className="text-xs font-light text-neutral-500">
                                  {project.description}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
