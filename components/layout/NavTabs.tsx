import { cn } from '../../utils/cn';
import { useEmailStore } from '../../store/emailStore';
import type { ViewMode } from '../../types/ui';

interface Tab {
  id: ViewMode;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: 'stacks', label: 'Stacks', icon: '📂' },
  { id: 'senders', label: 'Senders', icon: '👤' },
];

export function NavTabs() {
  const { viewMode, setViewMode } = useEmailStore();

  return (
    <nav className="flex items-center gap-1 px-4 py-2 border-b border-border" aria-label="View mode">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setViewMode(tab.id)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium',
            'transition-all duration-200',
            viewMode === tab.id
              ? 'bg-accent/15 text-accent'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
          )}
          aria-selected={viewMode === tab.id}
          role="tab"
        >
          <span className="text-xs">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
