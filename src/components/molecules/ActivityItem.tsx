import React from "react";
import Avatar from "../atoms/Avatar";
import type { Activity } from "../../types";
import { twMerge } from "tailwind-merge";

interface ActivityItemProps {
	activity: Activity;
	className?: string;
	compact?: boolean;
	onClick?: (activity: Activity) => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
	activity,
	className,
	compact,
	onClick,
}) => {
	return (
		<div
			className={twMerge("flex gap-4 group cursor-pointer", className)}
			onClick={() => onClick?.(activity)}
		>
			<div className="relative">
				<Avatar
					name={activity.userId || "System User"}
					size={compact ? "xs" : "md"}
				/>
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex justify-between items-start mb-1">
					<p
						className={twMerge(
							"text-text-main leading-snug",
							compact ? "text-[11px]" : "text-sm",
						)}
					>
						<span className="font-bold text-text-main group-hover:text-primary transition-colors">
							System User
						</span>{" "}
						{activity.action}{" "}
						<span className="text-primary font-bold">{activity.target}</span>
					</p>
					<span className="text-[10px] text-text-muted uppercase tracking-wider">
						{new Date(activity.createdAt).toLocaleDateString()}
					</span>
				</div>
				<div className="bg-background p-3 rounded-md border border-border text-xs text-text-muted mt-2 group-hover:border-text-muted transition-colors">
					Activity trace captured via global project ledger.
				</div>
			</div>
		</div>
	);
};

export default ActivityItem;
