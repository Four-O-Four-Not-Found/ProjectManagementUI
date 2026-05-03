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
		"inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed tracking-tight select-none";

	const variants = {
		primary: "bg-gray-900 text-white hover:bg-gray-800 shadow-sm",
		secondary:
			"bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 shadow-sm dark:bg-gray-900 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800",
		ghost:
			"bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800",
		danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
		success: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm",
		warning: "bg-amber-500 text-white hover:bg-amber-600 shadow-sm",
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
