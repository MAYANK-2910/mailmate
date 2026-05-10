import { cn } from '../../utils/cn';
import { useEmailStore } from '../../store/emailStore';
import { useTheme } from '../../hooks/useTheme';
import { Toggle } from '../ui/Toggle';
import { Badge } from '../ui/Badge';
import { useFocusMode } from '../../hooks/useFocusMode';

export function Header() {
  const { totalUnread, isSearchOpen, toggleSearch } = useEmailStore();
  const { theme, toggleTheme } = useTheme();
  const { focusMode, toggleFocusMode, focusStats } = useFocusMode();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-secondary/80 backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xl" role="img" aria-label="Mailman logo">📬</span>
          <h1 className="text-base font-bold text-text-primary tracking-tight">
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

        <button
          onClick={() => toggleFocusMode()}
          className={cn(
            'p-1.5 rounded-lg text-sm transition-all duration-200',
            'hover:bg-bg-tertiary',
            focusMode && 'text-accent bg-accent/10'
          )}
          aria-label="Toggle focus mode"
          title="Focus mode (F)"
        >
          🎯
        </button>

        <button
          onClick={toggleSearch}
          className={cn(
            'p-1.5 rounded-lg text-sm transition-all duration-200 hover:bg-bg-tertiary',
            isSearchOpen && 'text-accent bg-accent/10'
          )}
          aria-label="Search"
          title="Search (⌘K)"
        >
          🔍
        </button>

        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg text-sm transition-all duration-200 hover:bg-bg-tertiary"
          aria-label="Toggle theme"
          title="Toggle theme (T)"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
