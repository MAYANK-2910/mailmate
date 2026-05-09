import { getAvatarColor, getInitials } from '../../utils/avatar';
import { cn } from '../../utils/cn';

interface AvatarProps {
  name: string;
  email: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-7 h-7 text-[10px]',
  md: 'w-9 h-9 text-xs',
  lg: 'w-11 h-11 text-sm',
};

export function Avatar({ name, email, size = 'md', className }: AvatarProps) {
  const initials = getInitials(name);
  const bgColor = getAvatarColor(email);

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-semibold text-white shrink-0',
        'transition-transform duration-150 hover:scale-105',
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: bgColor }}
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  );
}
