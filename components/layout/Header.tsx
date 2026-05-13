import { cn } from '../../utils/cn';
import { useEmailStore } from '../../store/emailStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Toggle } from '../ui/Toggle';
import { Badge } from '../ui/Badge';
import { useFocusMode } from '../../hooks/useFocusMode';

export function Header() {
  const { totalUnread, isSearchOpen, toggleSearch } = useEmailStore();
  const { enableFocusMode } = useSettingsStore();
  const { focusMode, toggleFocusMode, focusStats } = useFocusMode();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-secondary">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-accent">mail</span>
          <h1 className="text-[15px] font-medium text-text-primary tracking-tight">
            Mailman
          </h1>
        </div>
        {totalUnread > 0 && (
          <Badge variant="count" className="bg-accent/20 text-accent">
            {totalUnread}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        {focusMode && (
          <span className="text-[10px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
            Focus · {focusStats.hiddenEmails} hidden
          </span>
        )}

        {enableFocusMode && (
          <button
            onClick={() => toggleFocusMode()}
            className={cn(
              'p-1.5 rounded-full text-sm transition-all duration-200 flex items-center justify-center',
              'hover:bg-bg-hover text-text-secondary',
              focusMode && 'text-accent bg-accent/10'
            )}
            aria-label="Toggle focus mode"
            title="Focus mode (F)"
          >
            <span className="material-symbols-outlined text-[20px]">filter_center_focus</span>
          </button>
        )}

        <button
          onClick={toggleSearch}
          className={cn(
            'p-1.5 rounded-full text-sm transition-all duration-200 hover:bg-bg-hover flex items-center justify-center text-text-secondary',
            isSearchOpen && 'text-accent bg-accent/10'
          )}
          aria-label="Search"
          title="Search (⌘K)"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>
      </div>
    </header>
  );
}
