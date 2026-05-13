import { cn } from '../../utils/cn';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-8 text-center animate-fade-in',
        className
      )}
    >
      <span className="material-symbols-outlined text-5xl mb-4 text-text-muted" aria-hidden="true">
        {icon}
      </span>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-sm text-text-secondary max-w-[280px] leading-relaxed">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            'mt-6 px-5 py-2 rounded-lg text-sm font-medium',
            'bg-accent text-white hover:bg-accent-hover',
            'transition-all duration-200 hover:shadow-lg hover:shadow-accent/20',
            'active:scale-95'
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
