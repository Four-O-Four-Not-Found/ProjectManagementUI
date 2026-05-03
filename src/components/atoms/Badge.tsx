import React from "react";
import { twMerge } from "tailwind-merge";

interface BadgeProps {
	children: React.ReactNode;
	variant?:
		| "primary"
		| "secondary"
		| "success"
		| "warning"
		| "danger"
		| "purple";
	size?: "xs" | "sm" | "md";
	className?: string;
}

const Badge: React.FC<BadgeProps> = ({
	children,
	variant = "secondary",
	size = "sm",
	className,
}) => {
	const variants = {
		primary: "bg-[var(--color-primary)] text-white border-transparent",
		secondary:
			"bg-[var(--surface-hover)] text-[var(--text-muted)] border-[var(--border-subtle)]",
		success: "bg-[#238636] text-white border-transparent",
		warning: "bg-[#9e6a03] text-white border-transparent",
		danger: "bg-[#da3633] text-white border-transparent",
		purple: "bg-[#8250df] text-white border-transparent",
	};

	const sizes = {
		xs: "px-1.5 py-0.5 text-[10px]",
		sm: "px-2 py-0.5 text-[11px]",
		md: "px-2.5 py-1 text-xs",
	};

	return (
		<span
			className={twMerge(
				"inline-flex items-center justify-center font-semibold border rounded-md tracking-tight",
				variants[variant],
				sizes[size],
				className,
			)}
		>
			{children}
		</span>
	);
};

export default Badge;
