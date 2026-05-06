import React from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({ label, icon, error, helperText, className, ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-xs font-semibold text-text-main block ml-0.5">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        <input
          className={twMerge(
            "w-full bg-background border border-primary/30 rounded-md py-1.5 text-sm text-text-main placeholder:text-text-muted outline-none transition-all",
            "focus:border-primary focus:ring-1 focus:ring-primary shadow-sm",
            icon ? "pl-10 pr-4" : "px-3",
            error && "border-primary focus:border-primary focus:ring-danger",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-[10px] font-bold text-primary ml-1">{error}</p>}
      {helperText && !error && (
        <p className="text-[10px] text-text-muted ml-1 opacity-70 italic">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
