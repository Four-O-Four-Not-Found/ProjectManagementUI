import React from "react";
import { twMerge } from "tailwind-merge";

interface AvatarProps {
	src?: string;
	alt?: string;
	name?: string;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	className?: string;
	isClickable?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
	src,
	alt,
	name,
	size = "md",
	className,
	isClickable = false,
}) => {
	const sizes = {
		xs: "w-6 h-6 rounded-lg",
		sm: "w-8 h-8 rounded-lg",
		md: "w-10 h-10 rounded-xl",
		lg: "w-12 h-12 rounded-2xl",
		xl: "w-16 h-16 rounded-[24px]",
	};

	const avatarSrc =
		src || `https://api.dicebear.com/7.x/initials/svg?seed=${name || "User"}&backgroundColor=000000&textColor=3b82f6`;

	return (
		<div
			className={twMerge(
				"relative flex-shrink-0 bg-[var(--accent-primary)]/10 border border-primary/30 overflow-hidden group",
				sizes[size],
				isClickable && "cursor-pointer active:scale-95 transition-transform",
				className,
			)}
		>
			<img
				src={avatarSrc}
				alt={alt || name || "Avatar"}
				className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 grayscale"
			/>
		</div>
	);
};

export default Avatar;
