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
    primary: "bg-[var(--color-primary)] text-white border-transparent",
    secondary: "bg-[var(--surface-hover)] text-[var(--text-muted)] border-[var(--border-subtle)]",
    success: "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20",
    warning: "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20",
    danger: "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  const sizes = {
    xs: "px-1.5 py-0.5 text-[10px]",
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span className={twMerge(
      "inline-flex items-center justify-center font-semibold border rounded-md tracking-tight",
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;
