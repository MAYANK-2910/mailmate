import { cn } from '../../utils/cn';
import { useEmailStore } from '../../store/emailStore';
import { Avatar } from '../ui/Avatar';
import { Badge, PriorityBadge } from '../ui/Badge';
import { formatRelativeTime } from '../../utils/date';
import { CATEGORY_MAP } from '../../constants/categories';
import { StaggerChildren, StaggerItem } from '../animations/StaggerChildren';
import { EmptyState } from '../ui/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import type { Stack } from '../../types/stack';
import type { Email } from '../../types/email';

interface StackListProps {
  stacks: Stack[];
}

export function StackList({ stacks }: StackListProps) {
  if (stacks.length === 0) {
    return (
      <EmptyState
        icon="inbox"
        title="No stacks yet"
        description="Your email stacks will appear here once emails are loaded."
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <StaggerChildren className="p-3 space-y-2">
        {stacks.map((stack) => (
          <StaggerItem key={stack.id}>
            <StackCard stack={stack} />
          </StaggerItem>
        ))}
      </StaggerChildren>
    </div>
  );
}

function StackCard({ stack }: { stack: Stack }) {
  const { toggleStackCollapse, selectEmail, selectedEmail } = useEmailStore();
  const config = CATEGORY_MAP.get(stack.category);

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-bg-secondary',
        'transition-all duration-200',
        'hover:shadow-sm hover:bg-bg-hover'
      )}
    >
      <button
        onClick={() => toggleStackCollapse(stack.id)}
        className="flex items-center justify-between w-full px-3.5 py-2.5 text-left group"
        aria-expanded={!stack.isCollapsed}
        aria-label={`${stack.label} stack, ${stack.unreadCount} unread`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="material-symbols-outlined text-[20px] shrink-0" style={{ color: config?.color }}>
            {stack.icon}
          </span>
          <span className="text-sm font-medium text-text-primary truncate">
            {stack.label}
          </span>
          {stack.unreadCount > 0 && (
            <Badge variant="count" color={config?.color}>
              {stack.unreadCount}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-text-muted">
            {stack.totalCount}
          </span>
          <motion.span
            animate={{ rotate: stack.isCollapsed ? -90 : 0 }}
            transition={{ duration: 0.2 }}
            className="material-symbols-outlined text-text-muted text-[16px]"
          >
            expand_more
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {!stack.isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-1.5 pb-1.5">
              {stack.emails.slice(0, 8).map((email) => (
                <EmailRow
                  key={email.id}
                  email={email}
                  isSelected={selectedEmail?.id === email.id}
                  onSelect={() => selectEmail(email)}
                />
              ))}
              {stack.emails.length > 8 && (
                <div className="text-center py-1.5">
                  <span className="text-[11px] text-text-muted">
                    +{stack.emails.length - 8} more
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface EmailRowProps {
  email: Email;
  isSelected: boolean;
  onSelect: () => void;
}

function EmailRow({ email, isSelected, onSelect }: EmailRowProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-left',
        'transition-all duration-150 group',
        isSelected
          ? 'bg-accent/12 border border-accent/20'
          : 'hover:bg-bg-tertiary border border-transparent',
        email.isUnread && 'font-medium'
      )}
      aria-label={`Email from ${email.sender.name}: ${email.subject}`}
      aria-selected={isSelected}
    >
      <Avatar
        name={email.sender.name}
        email={email.sender.email}
        size="sm"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'text-[12px] truncate',
              email.isUnread ? 'text-text-primary font-semibold' : 'text-text-secondary'
            )}
          >
            {email.sender.name}
          </span>
          <span className="text-[10px] text-text-muted shrink-0">
            {formatRelativeTime(email.date)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {email.isUnread && (
            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
          )}
          <span className="text-[11px] text-text-secondary truncate">
            {email.subject}
          </span>
        </div>
      </div>

      {email.priority === 'critical' && (
        <span className="w-2 h-2 rounded-full bg-danger shrink-0" title="Critical" />
      )}
    </button>
  );
}
