import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ProgressBarProps {
  progress: number;
  variant?: 'sm' | 'md' | 'lg';
  className?: string;
  colorClass?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  variant = 'md', 
  className,
  colorClass = 'bg-success'
}) => {
  const heights = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={twMerge(
      "w-full bg-background border border-border rounded-full overflow-hidden",
      heights[variant],
      className
    )}>
      <div 
        className={twMerge("h-full transition-all duration-500", colorClass)}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
