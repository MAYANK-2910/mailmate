import { cn } from '../../utils/cn';
import { useSearch } from '../../hooks/useSearch';
import { Avatar } from '../ui/Avatar';
import { formatRelativeTime } from '../../utils/date';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function SearchBar() {
  const { searchQuery, searchResults, isSearchOpen, inputRef, handleQueryChange, handleSelectResult, handleClose } = useSearch();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => { setSelectedIndex(0); }, [searchResults]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
      e.preventDefault();
      handleSelectResult(searchResults[selectedIndex].id);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-overlay z-40" onClick={handleClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: -10 }} transition={{ duration: 0.15 }} className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
            <div className="bg-bg-secondary border border-border rounded-xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <span className="text-text-muted text-sm">🔍</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search emails by sender, subject, category..."
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                  aria-label="Search emails"
                />
                <kbd className="text-[10px] text-text-muted bg-bg-tertiary px-1.5 py-0.5 rounded">ESC</kbd>
              </div>

              {searchResults.length > 0 && (
                <div className="max-h-64 overflow-y-auto scrollbar-thin py-1">
                  {searchResults.map((email, i) => (
                    <button
                      key={email.id}
                      onClick={() => handleSelectResult(email.id)}
                      className={cn(
                        'flex items-center gap-2.5 w-full px-4 py-2 text-left transition-colors',
                        i === selectedIndex ? 'bg-accent/10' : 'hover:bg-bg-tertiary'
                      )}
                    >
                      <Avatar name={email.sender.name} email={email.sender.email} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-text-primary truncate">{email.sender.name}</span>
                          <span className="text-[10px] text-text-muted shrink-0">{formatRelativeTime(email.date)}</span>
                        </div>
                        <p className="text-[11px] text-text-secondary truncate">{email.subject}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {searchQuery && searchResults.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-text-muted">No results for "{searchQuery}"</p>
                </div>
              )}

              <div className="flex items-center gap-3 px-4 py-2 border-t border-border text-[10px] text-text-muted">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>Esc Close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
