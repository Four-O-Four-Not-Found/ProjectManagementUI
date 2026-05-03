import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  loading,
  fullWidth,
  leftIcon,
  rightIcon,
  children,
  ...props
}) => {
  const isButtonLoading = isLoading || loading;
  const baseStyles = "inline-flex items-center justify-center rounded-md font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider shadow-sm";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-surface border border-border text-text-main hover:bg-surface-hover hover:border-text-muted",
    ghost: "bg-transparent text-text-muted hover:text-text-main hover:bg-surface-hover shadow-none",
    danger: "bg-danger text-white hover:bg-danger/90",
    success: "bg-success text-white hover:bg-success/90",
    warning: "bg-warning text-white hover:bg-warning/90",
  };

  const sizes = {
    xs: "px-2 py-1 text-[10px] gap-1 rounded",
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-3",
  };

  return (
    <button
      className={twMerge(
        baseStyles, 
        variants[variant], 
        sizes[size], 
        fullWidth ? "w-full" : "",
        className
      )}
      disabled={isButtonLoading || props.disabled}
      {...props}
    >
      {isButtonLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
