import React from 'react';
import { twMerge } from 'tailwind-merge';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'purple' | 'cyan';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'secondary', 
  size = 'sm',
  className 
}) => {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-white/[0.03] text-slate-400 border-white/[0.05]",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    purple: "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
    cyan: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20",
  };

  const sizes = {
    xs: "px-1.5 py-0.5 text-[9px]",
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span className={twMerge(
      "inline-flex items-center font-bold uppercase tracking-widest rounded-full border",
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;
