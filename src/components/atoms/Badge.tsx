import React from 'react';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'purple';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'secondary', size = 'sm', className }) => {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-surface border-border text-text-muted",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    danger: "bg-danger/10 text-danger border-danger/20",
    purple: "bg-merged/10 text-merged border-merged/20",
  };

  const sizes = {
    xs: "px-1.5 py-0.5 text-[9px]",
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span className={twMerge(
      "inline-flex items-center justify-center font-bold border rounded-full uppercase tracking-wider",
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;
