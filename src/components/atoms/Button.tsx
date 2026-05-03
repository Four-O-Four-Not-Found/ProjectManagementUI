import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?:
		| "primary"
		| "secondary"
		| "ghost"
		| "danger"
		| "success"
		| "warning";
	size?: "xs" | "sm" | "md" | "lg";
	isLoading?: boolean;
	loading?: boolean;
	fullWidth?: boolean;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
	className,
	variant = "primary",
	size = "md",
	isLoading,
	loading,
	fullWidth,
	leftIcon,
	rightIcon,
	children,
	...props
}) => {
	const isButtonLoading = isLoading || loading;
	const baseStyles =
		"inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed tracking-tight select-none border";

	const variants = {
		primary: "bg-[var(--color-primary)] text-white border-transparent hover:opacity-90 shadow-sm",
		secondary: "bg-[var(--surface-hover)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)] shadow-sm",
		ghost: "bg-transparent text-[var(--text-muted)] border-transparent hover:text-[var(--text-main)] hover:bg-[var(--surface-hover)]",
		danger: "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/20 hover:bg-[var(--color-danger)]/20",
		success: "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20 hover:bg-[var(--color-success)]/20",
		warning: "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20 hover:bg-[var(--color-warning)]/20",
		purple: "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
	};

	const sizes = {
		xs: "px-2 py-1 text-[11px] gap-1 rounded-md",
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
				className,
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
