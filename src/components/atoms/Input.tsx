import React from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode; // Alias for leftIcon
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  icon,
  className,
  ...props
}) => {
  const actualLeftIcon = icon || leftIcon;

  return (
    <div className="space-y-2 w-full group">
      {label && (
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1 group-focus-within:text-primary transition-colors">
          {label}
        </label>
      )}
      <div className="relative">
        {actualLeftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
            {actualLeftIcon}
          </div>
        )}
        <input
          className={twMerge(
            "w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl py-3 text-sm text-white outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-600",
            actualLeftIcon ? "pl-12" : "pl-4",
            rightIcon ? "pr-12" : "pr-4",
            error && "border-rose-500/50 focus:border-rose-500",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-[10px] text-rose-400 font-bold ml-1 uppercase tracking-wider">{error}</p>
      )}
    </div>
  );
};

export default Input;
