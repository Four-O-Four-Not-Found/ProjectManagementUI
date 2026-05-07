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
	id?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({
	children,
	className,
	isHoverable = true,
	isInteractive = false,
	noPadding = false,
	onClick,
	style,
	id,
}) => {
	return (
		<div
			id={id}
			onClick={onClick}
			style={style}
			className={twMerge(
				"bg-[#1e293b] border border-[#334155] rounded-lg relative overflow-hidden transition-all duration-200",
				isHoverable && "hover:border-[#475569] hover:bg-[#243045]",
				isInteractive && "cursor-pointer active:opacity-80",
				noPadding ? "p-0" : "p-4 md:p-6",
				className,
			)}
		>
			{children}
		</div>
	);
};

export default GlassCard;
