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
		"inline-flex items-center justify-center rounded-md font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed tracking-tight select-none border shadow-sm cursor-pointer";

	const variants = {
		primary: "bg-[var(--accent-primary)] text-white border-transparent hover:bg-[var(--accent-secondary)] hover:-translate-y-[0.5px] hover:shadow-[0_2px_8px_rgba(37,99,235,0.2)] active:translate-y-0",
		secondary: "bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:bg-[var(--text-secondary)]/5 hover:border-[var(--text-secondary)]/20",
		ghost: "bg-transparent text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)] hover:bg-[var(--text-secondary)]/5 shadow-none",
		danger: "bg-[var(--bg-color)] text-[var(--color-danger)] border-[var(--color-danger)]/20 hover:bg-[var(--color-danger)] hover:text-white hover:border-[var(--color-danger)]",
		success: "bg-[var(--color-success)] text-white border-transparent hover:opacity-90 hover:shadow-sm hover:-translate-y-[0.5px]",
		warning: "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20 hover:bg-[var(--color-warning)]/20",
		purple: "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] border-[var(--color-accent-primary)]/20 hover:bg-[var(--color-accent-primary)]/20",
	};

	const sizes = {
		xs: "px-2.5 py-1 text-[11px] gap-1",
		sm: "px-3 py-1.5 text-xs gap-1.5",
		md: "px-4 py-2 text-sm gap-2",
		lg: "px-6 py-3 text-base gap-3",
	};

	return (
		<button
			className={twMerge(
				baseStyles,
				variants[variant as keyof typeof variants],
				sizes[size],
				fullWidth ? "w-full" : "",
				isButtonLoading ? "pointer-events-none opacity-80" : "",
				className,
			)}
			disabled={isButtonLoading || props.disabled}
			{...props}
		>
			{isButtonLoading ? (
				<div className="flex items-center gap-2">
					<div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
					{size !== "xs" && <span>Processing...</span>}
				</div>
			) : (
				<>
					{leftIcon && <span className="flex-shrink-0 opacity-80">{leftIcon}</span>}
					{children}
					{rightIcon && <span className="flex-shrink-0 opacity-80">{rightIcon}</span>}
				</>
			)}
		</button>
	);
};

export default Button;
