import React from 'react';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  isHoverable?: boolean;
  isInteractive?: boolean;
  noPadding?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  isHoverable = false,
  isInteractive = false,
  noPadding = false
}) => {
  return (
    <div className={twMerge(
      "glass-panel rounded-3xl relative overflow-hidden",
      isHoverable && "hover:bg-white/[0.05] transition-all duration-300",
      isInteractive && "cursor-pointer active:scale-[0.99]",
      noPadding ? "p-0" : "p-6",
      className
    )}>
      {children}
    </div>
  );
};

export default GlassCard;
