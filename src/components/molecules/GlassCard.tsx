import React from "react";
import { twMerge } from "tailwind-merge";

interface GlassCardProps {
	children: React.ReactNode;
	className?: string;
	isHoverable?: boolean;
	isInteractive?: boolean;
	noPadding?: boolean;
	onClick?: () => void;
	style?: React.CSSProperties;
}

const GlassCard: React.FC<GlassCardProps> = ({
	children,
	className,
	isHoverable = true,
	isInteractive = false,
	noPadding = false,
	onClick,
	style,
}) => {
	return (
		<div
			onClick={onClick}
			style={style}
			className={twMerge(
				"glass-card animate-slide-up relative overflow-hidden",
				isHoverable && "hover:translate-y-[-2px] hover:shadow-sm",
				isInteractive && "cursor-pointer active:scale-[0.99]",
				noPadding ? "p-0" : "p-4 md:p-6",
				className,
			)}
		>
			{children}
		</div>
	);
};

export default GlassCard;
