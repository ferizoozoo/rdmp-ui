import { Tab } from '@/app/types/roadmapView';

export const COLORS = [
  { accent: 'bg-orange-500', light: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', dot: 'bg-orange-500' },
  { accent: 'bg-yellow-400', light: 'bg-yellow-400/10', border: 'border-yellow-400/20', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  { accent: 'bg-sky-400', light: 'bg-sky-400/10', border: 'border-sky-400/20', text: 'text-sky-400', dot: 'bg-sky-400' },
  { accent: 'bg-violet-400', light: 'bg-violet-400/10', border: 'border-violet-400/20', text: 'text-violet-400', dot: 'bg-violet-400' },
  { accent: 'bg-emerald-400', light: 'bg-emerald-400/10', border: 'border-emerald-400/20', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  { accent: 'bg-pink-400', light: 'bg-pink-400/10', border: 'border-pink-400/20', text: 'text-pink-400', dot: 'bg-pink-400' },
] as const;

export const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'timeline', label: 'Timeline' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
];

export const SECONDARY_BUTTON_CLASS =
  'rounded-full border border-neutral-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300 transition-colors hover:border-neutral-500 hover:text-neutral-100';

export function getRoadmapColor(index: number) {
  return COLORS[index % COLORS.length];
}
