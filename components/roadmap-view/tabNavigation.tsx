import { Tab } from '@/app/types/roadmapView';
import { TABS } from './constants';

type TabNavigationProps = {
  activeTab: Tab;
  onSelectTab: (tab: Tab) => void;
};

export function TabNavigation({ activeTab, onSelectTab }: TabNavigationProps) {
  return (
    <div className="flex border-b border-neutral-800 px-6 md:px-12">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onSelectTab(tab.id)}
          className={`relative px-6 py-4 text-xs font-semibold uppercase tracking-widest transition-colors ${
            activeTab === tab.id
              ? 'text-neutral-100'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-px bg-orange-500" />
          )}
        </button>
      ))}
    </div>
  );
}
