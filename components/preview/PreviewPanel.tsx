import { cn } from '../../utils/cn';
import { useEmailStore } from '../../store/emailStore';
import { Avatar } from '../ui/Avatar';
import { PriorityBadge } from '../ui/Badge';
import { formatFullDate, formatRelativeTime } from '../../utils/date';
import { sanitizeHtml } from '../../utils/sanitize';
import { CATEGORY_MAP } from '../../constants/categories';
import { EmptyState } from '../ui/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';

export function PreviewPanel() {
  const { selectedEmail, selectEmail, panelView } = useEmailStore();

  if (panelView !== 'preview' || !selectedEmail) {
    return (
      <EmptyState
        icon="✉️"
        title="Select an email"
        description="Click on an email to preview it here. Use J/K to navigate."
      />
    );
  }

  const categoryConfig = CATEGORY_MAP.get(selectedEmail.category);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedEmail.id}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="flex flex-col h-full"
      >
        <div className="px-4 py-3 border-b border-border bg-bg-secondary/50">
          <div className="flex items-start gap-3">
            <Avatar name={selectedEmail.sender.name} email={selectedEmail.sender.email} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-text-primary truncate">{selectedEmail.sender.name}</h2>
                  <p className="text-[11px] text-text-muted truncate">{selectedEmail.sender.email}</p>
                </div>
                <span className="text-[10px] text-text-muted shrink-0 mt-0.5">{formatRelativeTime(selectedEmail.date)}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <PriorityBadge level={selectedEmail.priority} />
                {categoryConfig && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full" style={{ backgroundColor: categoryConfig.bgColor, color: categoryConfig.color }}>
                    {categoryConfig.icon} {categoryConfig.label}
                  </span>
                )}
              </div>
            </div>
          </div>
          <h3 className="text-base font-semibold text-text-primary mt-3 leading-snug">{selectedEmail.subject}</h3>
          <p className="text-[10px] text-text-muted mt-1">{formatFullDate(selectedEmail.date)}</p>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4">
          {selectedEmail.body ? (
            <div
              className="text-sm text-text-primary leading-relaxed max-w-none [&_a]:text-accent [&_a]:underline [&_img]:max-w-full [&_img]:rounded-lg [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_pre]:bg-bg-tertiary [&_pre]:rounded-lg [&_pre]:p-3"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedEmail.body) }}
            />
          ) : (
            <p className="text-sm text-text-secondary italic">{selectedEmail.snippet || 'No content available'}</p>
          )}
        </div>

        <div className="flex items-center gap-1 px-4 py-2.5 border-t border-border bg-bg-secondary/50">
          <ActionButton icon="↩️" label="Reply" shortcut="R" />
          <ActionButton icon="↪️" label="Forward" />
          <ActionButton icon="📁" label="Archive" shortcut="E" />
          <ActionButton icon={selectedEmail.isStarred ? '⭐' : '☆'} label="Star" shortcut="S" />
          <div className="flex-1" />
          <button onClick={() => selectEmail(null)} className="text-[11px] text-text-muted hover:text-text-secondary transition-colors px-2 py-1 rounded">
            Close · Esc
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ActionButton({ icon, label, shortcut }: { icon: string; label: string; shortcut?: string }) {
  return (
    <button
      className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all duration-150 active:scale-95')}
      aria-label={label}
      title={shortcut ? `${label} (${shortcut})` : label}
    >
      <span className="text-sm">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
