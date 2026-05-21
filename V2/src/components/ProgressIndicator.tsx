'use client';

interface ProgressIndicatorProps {
  completed: number;
  total: number;
  label?: string;
}

export function ProgressIndicator({ completed, total, label = 'Progress' }: ProgressIndicatorProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{completed} / {total} fields</span>
          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold">
            {percentage}%
          </span>
        </div>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {percentage === 100 && (
        <div className="text-xs text-green-600 font-medium flex items-center gap-1.5 animate-fade-in">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Section completed!
        </div>
      )}
    </div>
  );
}
