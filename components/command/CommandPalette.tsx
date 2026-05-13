import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../state/ui/uiStore';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPalette } = useUIStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPalette(true);
      }
      if (e.key === 'Escape') {
        setCommandPalette(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-[1000000] flex items-start justify-center pt-[15vh] px-4 bg-black/20 backdrop-blur-sm" onClick={() => setCommandPalette(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-xl bg-bg-primary rounded-2xl shadow-2xl border border-border overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center px-4 py-3 border-b border-border">
              <span className="material-symbols-outlined text-text-muted mr-3">search</span>
              <input
                autoFocus
                className="flex-1 bg-transparent border-none outline-none text-text-primary text-sm placeholder:text-text-muted"
                placeholder="Search stacks, commands, or emails (Cmd+K)"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            
            <div className="p-2 max-h-[400px] overflow-auto">
              <CommandItem icon="mail" label="Go to Inbox" shortcut="G then I" />
              <CommandItem icon="star" label="View Starred" shortcut="G then S" />
              <CommandItem icon="archive" label="Archive All in Stack" shortcut="Shift+E" />
              <CommandItem icon="delete" label="Delete Newsletters" shortcut="Shift+#" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const CommandItem = ({ icon, label, shortcut }: { icon: string; label: string; shortcut?: string }) => (
  <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-bg-hover cursor-pointer group transition-colors">
    <span className="material-symbols-outlined text-text-muted group-hover:text-accent">{icon}</span>
    <span className="flex-1 text-sm text-text-primary">{label}</span>
    {shortcut && <span className="text-[10px] text-text-muted bg-bg-tertiary px-1.5 py-0.5 rounded font-mono">{shortcut}</span>}
  </div>
);
