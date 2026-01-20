import { cn } from '@/lib/utils';

interface UsageBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function UsageBar({
  value,
  max = 100,
  showLabel = true,
  size = 'md',
}: UsageBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const getColorClass = () => {
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 70) return 'bg-warning';
    return 'bg-success';
  };

  const sizeClass = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={cn('usage-bar flex-1', sizeClass[size])}>
        <div
          className={cn('usage-bar-fill', getColorClass())}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="min-w-[3rem] text-sm font-medium text-muted-foreground">
          {percentage.toFixed(0)}%
        </span>
      )}
    </div>
  );
}
