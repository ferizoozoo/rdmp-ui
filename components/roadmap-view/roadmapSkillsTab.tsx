import { Roadmap } from '@/app/types/roadmap';
import { ResourceList } from './resourceList';
import { getRoadmapColor } from './constants';

type RoadmapSkillsTabProps = {
  roadmap: Roadmap;
  completedSkillSet: Set<string>;
  onToggleSkill: (name: string) => void;
};

export function RoadmapSkillsTab({
  roadmap,
  completedSkillSet,
  onToggleSkill,
}: RoadmapSkillsTabProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {roadmap.skills.map((skill, index) => {
        const color = getRoadmapColor(index);
        const isCompleted = completedSkillSet.has(skill.name);

        return (
          <div
            key={skill.name}
            className={`flex flex-col gap-4 rounded-xl border p-6 ${color.border} ${color.light}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`h-2 w-2 rounded-full ${
                    isCompleted ? 'bg-emerald-400' : color.dot
                  }`}
                />
                <h3
                  className={`text-sm font-semibold tracking-wide ${
                    isCompleted ? 'text-emerald-100' : 'text-neutral-100'
                  }`}
                >
                  {skill.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onToggleSkill(skill.name)}
                className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                    : `${color.border} ${color.text} hover:border-orange-400/50 hover:text-orange-300`
                }`}
              >
                {isCompleted ? 'Completed' : 'Mark done'}
              </button>
            </div>

            <p
              className={`text-sm font-light leading-relaxed ${
                isCompleted ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            >
              {skill.description}
            </p>

            <ResourceList resources={skill.resources} accentTextClass={color.text} />
          </div>
        );
      })}
    </div>
  );
}
