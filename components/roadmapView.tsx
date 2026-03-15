'use client';

import { useState } from 'react';
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

export default function RoadmapView({ roadmap }: { roadmap: Roadmap }) {
  const [activeTab, setActiveTab] = useState<Tab>('timeline');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'timeline', label: 'Timeline' },
    { id: 'skills',   label: 'Skills'   },
    { id: 'projects', label: 'Projects' },
  ];

  // Build lookup maps so timeline can resolve skill/project details
  const skillMap = Object.fromEntries(roadmap.skills.map((s) => [s.name, s]));
  const projectMap = Object.fromEntries(roadmap.projects.map((p) => [p.name, p]));

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
                    {/* Month bubble */}
                    <div className="flex-shrink-0 z-10">
                      <div className={`w-10 h-10 rounded-full ${col.accent} flex items-center justify-center text-neutral-950 font-black text-sm`}>
                        {item.month}
                      </div>
                    </div>

                    {/* Card */}
                    <div className={`flex-1 border ${col.border} bg-neutral-900/50 rounded-xl p-5 flex flex-col gap-4`}>
                      <p className={`text-xs font-semibold uppercase tracking-widest ${col.text}`}>
                        Month {item.month}
                      </p>

                      {/* Skills this month */}
                      {item.skillsToLearn.length > 0 && (
                        <div>
                          <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2">Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {item.skillsToLearn.map((name, j) => (
                              <span
                                key={j}
                                className={`text-xs px-2.5 py-1 rounded-full ${col.light} ${col.text} border ${col.border}`}
                              >
                                {name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Projects this month */}
                      {item.projectsToBuild.length > 0 && (
                        <div>
                          <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2">Projects</p>
                          <div className="flex flex-col gap-1">
                            {item.projectsToBuild.map((name, j) => {
                              const proj = projectMap[name];
                              return (
                                <div key={j} className="flex items-start gap-2">
                                  <span className="text-neutral-600 text-xs mt-0.5">→</span>
                                  <div>
                                    <p className="text-sm text-neutral-200">{name}</p>
                                    {proj && (
                                      <p className="text-xs text-neutral-500 font-light">{proj.description}</p>
                                    )}
                                  </div>
                                </div>
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
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                    <h3 className="font-semibold text-neutral-100 text-sm tracking-wide">
                      {skill.name}
                    </h3>
                  </div>
                  <p className="text-neutral-400 text-sm leading-relaxed font-light">
                    {skill.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-neutral-800">
                    <p className={`text-xs font-semibold uppercase tracking-widest ${col.text} mb-2`}>
                      Resources
                    </p>
                    <ul className="flex flex-col gap-1">
                      {skill.resources.map((r, j) => (
                        <li key={j} className="text-xs text-neutral-500 flex items-start gap-2">
                          <span className="text-neutral-700 mt-0.5">–</span> {r}
                        </li>
                      ))}
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
              // Find which month this project appears in
              const appearsInMonth = roadmap.timeline.find((t) =>
                t.projectsToBuild.includes(project.name)
              )?.month;

              return (
                <div key={i} className={`border ${col.border} bg-neutral-900/50 rounded-xl p-6 flex flex-col gap-4`}>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-neutral-100 text-base">{project.name}</h3>
                    {appearsInMonth && (
                      <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${col.light} ${col.text} border ${col.border}`}>
                        Month {appearsInMonth}
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-400 text-sm leading-relaxed font-light">
                    {project.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-neutral-800">
                    <p className={`text-xs font-semibold uppercase tracking-widest ${col.text} mb-2`}>
                      Resources
                    </p>
                    <ul className="flex flex-col gap-1">
                      {project.resources.map((r, j) => (
                        <li key={j} className="text-xs text-neutral-500 flex items-start gap-2">
                          <span className="text-neutral-700 mt-0.5">–</span> {r}
                        </li>
                      ))}
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