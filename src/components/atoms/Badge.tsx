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
    primary: "bg-gray-900 text-white border-transparent",
    secondary: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-white/5 dark:text-gray-400 dark:border-white/10",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    warning: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    danger: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    purple: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
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
