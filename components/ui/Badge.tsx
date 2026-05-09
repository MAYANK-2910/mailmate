import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'count' | 'priority' | 'category';
  color?: string;
  className?: string;
}

export function Badge({ children, variant = 'count', color, className }: BadgeProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full whitespace-nowrap';

  const variantClasses = {
    count: 'min-w-[20px] h-5 px-1.5 text-[10px] bg-accent/20 text-accent',
    priority: 'px-2 py-0.5 text-[10px] uppercase tracking-wide',
    category: 'px-2 py-0.5 text-[11px]',
  };

  return (
    <span
      className={cn(baseClasses, variantClasses[variant], className)}
      style={color ? { backgroundColor: `${color}20`, color } : undefined}
    >
      {children}
    </span>
  );
}

interface PriorityBadgeProps {
  level: 'critical' | 'important' | 'medium' | 'low';
  className?: string;
}

const priorityConfig = {
  critical: { label: 'Critical', color: '#f87171', bg: 'rgba(248, 113, 113, 0.15)' },
  important: { label: 'Important', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' },
  medium: { label: 'Medium', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)' },
  low: { label: 'Low', color: '#8888a0', bg: 'rgba(136, 136, 160, 0.1)' },
};

export function PriorityBadge({ level, className }: PriorityBadgeProps) {
  const config = priorityConfig[level];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide rounded-full',
        className
      )}
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}
