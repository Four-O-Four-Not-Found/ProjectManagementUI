import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ProgressBarProps {
  progress: number;
  colorClass?: string;
  className?: string;
  showLabel?: boolean;
  label?: string;
  variant?: 'sm' | 'md' | 'lg';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  colorClass = 'bg-primary', 
  className,
  showLabel = false,
  label,
  variant = 'md'
}) => {
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={twMerge("space-y-2", className)}>
      {(showLabel || label) && (
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-300">{label}</span>
          <span className="text-slate-400">{progress}%</span>
        </div>
      )}
      <div className={twMerge(heights[variant], "w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.05]")}>
        <div 
          className={twMerge(
            "h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.05)]",
            colorClass
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
