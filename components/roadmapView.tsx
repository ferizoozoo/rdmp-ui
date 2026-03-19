'use client';

import { useEffect, useState } from 'react';
import { Roadmap } from '../app/types/roadmap';

const COLORS = [
  { accent: 'bg-orange-500', light: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', dot: 'bg-orange-500' },
  { accent: 'bg-yellow-400', light: 'bg-yellow-400/10', border: 'border-yellow-400/20', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  { accent: 'bg-sky-400',    light: 'bg-sky-400/10',    border: 'border-sky-400/20',    text: 'text-sky-400',    dot: 'bg-sky-400'    },
  { accent: 'bg-violet-400', light: 'bg-violet-400/10', border: 'border-violet-400/20', text: 'text-violet-400', dot: 'bg-violet-400' },
  { accent: 'bg-emerald-400',light: 'bg-emerald-400/10',border: 'border-emerald-400/20',text: 'text-emerald-400',dot: 'bg-emerald-400'},
  { accent: 'bg-pink-400',   light: 'bg-pink-400/10',   border: 'border-pink-400/20',   text: 'text-pink-400',   dot: 'bg-pink-400'   },
];

const c = (i: number) => COLORS[i % COLORS.length];

type Tab = 'timeline' | 'skills' | 'projects';

type CompletionState = {
  skills: string[];
  projects: string[];
};

function readCompletionState(storageKey: string): CompletionState {
  const emptyState: CompletionState = { skills: [], projects: [] };

  if (typeof window === 'undefined') {
    return emptyState;
  }

  const stored = localStorage.getItem(storageKey);

  if (!stored) {
    return emptyState;  debugger;
  }

  try {
    const parsed = JSON.parse(stored) as CompletionState;
    return {
      skills: parsed.skills ?? [],
      projects: parsed.projects ?? [],
    };
  } catch {
    return emptyState;
  }
}

export default function RoadmapView({ roadmap }: { roadmap: Roadmap }) {
  const roadmapStorageKey = `rdmp-progress:${JSON.stringify(roadmap)}`;
  const [activeTab, setActiveTab] = useState<Tab>('timeline');
  const [completionState, setCompletionState] = useState<CompletionState>(() =>
    readCompletionState(roadmapStorageKey)
  );
  const completedSkills = completionState.skills;
  const completedProjects = completionState.projects;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'timeline', label: 'Timeline' },
    { id: 'skills',   label: 'Skills'   },
    { id: 'projects', label: 'Projects' },
  ];

  const projectMap = Object.fromEntries(roadmap.projects.map((p) => [p.name, p]));
  const completedSkillSet = new Set(completedSkills);
  const completedProjectSet = new Set(completedProjects);
  const totalItems = roadmap.skills.length + roadmap.projects.length;
  const completedItems = completedSkills.length + completedProjects.length;
  const completionPercent = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  useEffect(() => {
    localStorage.setItem(roadmapStorageKey, JSON.stringify(completionState));
  }, [completionState, roadmapStorageKey]);

  const toggleSkill = (name: string) => {
    setCompletionState((current) => ({
      ...current,
      skills: current.skills.includes(name)
        ? current.skills.filter((item) => item !== name)
        : [...current.skills, name],
    }));
  };

  const toggleProject = (name: string) => {
    setCompletionState((current) => ({
      ...current,
      projects: current.projects.includes(name)
        ? current.projects.filter((item) => item !== name)
        : [...current.projects, name],
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-neutral-800 px-6 md:px-12 pt-20 pb-12">
        <div className="absolute right-0 top-0 text-[180px] font-black text-neutral-900 leading-none select-none pointer-events-none tracking-tighter">
          RDMP
        </div>
        <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-4">
          Your Learning Path
        </p>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-4">
          <span className="text-orange-500">{roadmap.timeline.length}-Month</span>
          <br />Roadmap
        </h1>
        <p className="text-neutral-400 text-sm max-w-md leading-relaxed font-light">
          {roadmap.skills.length} skills · {roadmap.projects.length} projects · {roadmap.timeline.length} months
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

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 px-6 md:px-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-6 text-xs font-semibold tracking-widest uppercase transition-colors relative
              ${activeTab === tab.id ? 'text-neutral-100' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-orange-500" />
            )}
          </button>
        ))}
      </div>

      <div className="px-6 md:px-12 py-12">

        {/* ── TIMELINE ── */}
        {activeTab === 'timeline' && (
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-neutral-800" />
            <div className="flex flex-col">
              {roadmap.timeline.map((item, i) => {
                const col = c(i);
                return (
                  <div key={i} className="flex gap-8 relative pb-10 last:pb-0">
                    <div className="flex-shrink-0 z-10">
                      <div className={`w-10 h-10 rounded-full ${col.accent} flex items-center justify-center text-neutral-950 font-black text-sm`}>
                        {item.month}
                      </div>
                    </div>
                    <div className={`flex-1 border ${col.border} bg-neutral-900/50 rounded-xl p-5 flex flex-col gap-4`}>
                      <p className={`text-xs font-semibold uppercase tracking-widest ${col.text}`}>
                        Month {item.month}
                      </p>
                      {item.skillsToLearn.length > 0 && (
                        <div>
                          <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2">Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {item.skillsToLearn.map((name, j) => (
                              <button
                                key={j}
                                type="button"
                                onClick={() => toggleSkill(name)}
                                aria-pressed={completedSkillSet.has(name)}
                                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                                  completedSkillSet.has(name)
                                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300 line-through'
                                    : `${col.light} ${col.text} ${col.border} hover:border-orange-400/50`
                                }`}
                              >
                                {completedSkillSet.has(name) ? `Done · ${name}` : name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {item.projectsToBuild.length > 0 && (
                        <div>
                          <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2">Projects</p>
                          <div className="flex flex-col gap-1">
                            {item.projectsToBuild.map((name, j) => {
                              const proj = projectMap[name];
                              return (
                                <button
                                  key={j}
                                  type="button"
                                  onClick={() => toggleProject(name)}
                                  aria-pressed={completedProjectSet.has(name)}
                                  className={`flex items-start gap-2 rounded-lg px-2 py-1.5 -mx-2 text-left transition-colors ${
                                    completedProjectSet.has(name)
                                      ? 'bg-emerald-500/10'
                                      : 'hover:bg-neutral-800/70'
                                  }`}
                                >
                                  <span className={`text-xs mt-0.5 ${completedProjectSet.has(name) ? 'text-emerald-400' : 'text-neutral-600'}`}>
                                    {completedProjectSet.has(name) ? '✓' : '→'}
                                  </span>
                                  <div>
                                    <p className={`text-sm ${completedProjectSet.has(name) ? 'text-emerald-200 line-through' : 'text-neutral-200'}`}>
                                      {name}
                                    </p>
                                    {proj && (
                                      <p className="text-xs text-neutral-500 font-light">{proj.description}</p>
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
        )}

        {/* ── SKILLS ── */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {roadmap.skills.map((skill, i) => {
              const col = c(i);
              return (
                <div key={i} className={`border ${col.border} ${col.light} rounded-xl p-6 flex flex-col gap-4`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${completedSkillSet.has(skill.name) ? 'bg-emerald-400' : col.dot}`} />
                      <h3 className={`font-semibold text-sm tracking-wide ${completedSkillSet.has(skill.name) ? 'text-emerald-100' : 'text-neutral-100'}`}>
                        {skill.name}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSkill(skill.name)}
                      className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                        completedSkillSet.has(skill.name)
                          ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                          : `${col.border} ${col.text} hover:border-orange-400/50 hover:text-orange-300`
                      }`}
                    >
                      {completedSkillSet.has(skill.name) ? 'Completed' : 'Mark done'}
                    </button>
                  </div>
                  <p className={`text-sm leading-relaxed font-light ${completedSkillSet.has(skill.name) ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    {skill.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-neutral-800">
                    <p className={`text-xs font-semibold uppercase tracking-widest ${col.text} mb-2`}>
                      Resources
                    </p>
                    <ul className="flex flex-col gap-1">
  {skill.resources.map((r, j) => {
    let isUrl = false
    let hostname = r
    try {
      const parsed = new URL(r)
      isUrl = true
      hostname = parsed.hostname.replace('www.', '')
    } catch {}
    return (
      <li key={j} className="text-xs text-neutral-500 flex items-start gap-2">
        <span className="text-neutral-700 mt-0.5">–</span>
        {isUrl ? (
         <a 
            href={r}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 decoration-neutral-700 hover:text-neutral-300 hover:decoration-neutral-400 transition-colors"
          >
            {hostname}
          </a>
        ) : (
          <span>{r}</span>
        )}
      </li>
    )
  })}
</ul>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── PROJECTS ── */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roadmap.projects.map((project, i) => {
              const col = c(i);
              const appearsInMonth = roadmap.timeline.find((t) =>
                t.projectsToBuild.includes(project.name)
              )?.month;

              return (
                <div key={i} className={`border ${col.border} bg-neutral-900/50 rounded-xl p-6 flex flex-col gap-4`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <h3 className={`font-semibold text-base ${completedProjectSet.has(project.name) ? 'text-emerald-100 line-through' : 'text-neutral-100'}`}>
                        {project.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {appearsInMonth && (
                          <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${col.light} ${col.text} border ${col.border}`}>
                            Month {appearsInMonth}
                          </span>
                        )}
                        {completedProjectSet.has(project.name) && (
                          <span className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/15 text-emerald-300">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleProject(project.name)}
                      className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                        completedProjectSet.has(project.name)
                          ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                          : `${col.border} ${col.text} hover:border-orange-400/50 hover:text-orange-300`
                      }`}
                    >
                      {completedProjectSet.has(project.name) ? 'Undo' : 'Mark done'}
                    </button>
                  </div>
                  <p className={`text-sm leading-relaxed font-light ${completedProjectSet.has(project.name) ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    {project.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-neutral-800">
                    <p className={`text-xs font-semibold uppercase tracking-widest ${col.text} mb-2`}>
                      Resources
                    </p>
                    <ul className="flex flex-col gap-1">
  {project.resources.map((r, j) => {
    let isUrl = false
    let hostname = r
    try {
      const parsed = new URL(r)
      isUrl = true
      hostname = parsed.hostname.replace('www.', '')
    } catch {}
    return (
      <li key={j} className="text-xs text-neutral-500 flex items-start gap-2">
        <span className="text-neutral-700 mt-0.5">–</span>
        {isUrl ? (
          <a
            href={r}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 decoration-neutral-700 hover:text-neutral-300 hover:decoration-neutral-400 transition-colors"
          >
            {hostname}
          </a>
        ) : (
          <span>{r}</span>
        )}
      </li>
    )
  })}
</ul>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
