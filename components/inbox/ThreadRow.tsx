import React from 'react';
import { Email } from '../../types/email';
import { format } from 'date-fns';
import { cn } from '../../utils/cn';
import { useUIStore } from '../../state/ui/uiStore';

interface ThreadRowProps {
  email: Email;
}

export const ThreadRow: React.FC<ThreadRowProps> = ({ email }) => {
  const { selectedThreads, toggleThread } = useUIStore();
  const isSelected = selectedThreads.has(email.id);

  return (
    <div className={cn(
      "group flex items-center gap-4 px-8 py-2 border-b border-border/50 hover:bg-bg-hover cursor-pointer transition-all",
      isSelected && "bg-accent/5 shadow-inner",
      !email.isRead && "font-bold text-text-primary"
    )}>
      <div 
        className="flex items-center gap-3"
        onClick={(e) => {
          e.stopPropagation();
          toggleThread(email.id);
        }}
      >
        <div className={cn(
          "w-4 h-4 rounded border border-text-muted flex items-center justify-center transition-colors",
          isSelected && "bg-accent border-accent"
        )}>
          {isSelected && <span className="material-symbols-outlined text-white text-[12px]">check</span>}
        </div>
        <span className="material-symbols-outlined text-text-muted text-[20px] hover:text-accent">
          star
        </span>
      </div>

      <div className="w-48 truncate text-sm">
        {email.from.name || email.from.email.split('@')[0]}
      </div>

      <div className="flex-1 min-w-0 flex items-center gap-2 overflow-hidden">
        <span className="text-sm truncate">{email.subject}</span>
        <span className="text-sm text-text-muted truncate font-normal">
          - {email.snippet}
        </span>
      </div>

      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 rounded-full hover:bg-bg-tertiary text-text-muted hover:text-text-primary">
          <span className="material-symbols-outlined text-[18px]">archive</span>
        </button>
        <button className="p-1.5 rounded-full hover:bg-bg-tertiary text-text-muted hover:text-danger">
          <span className="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>

      <div className="w-16 text-right text-xs text-text-muted whitespace-nowrap">
        {format(email.date, 'MMM d')}
      </div>
    </div>
  );
};
