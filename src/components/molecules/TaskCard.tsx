import React from "react";
import { motion } from "framer-motion";
import {
	MessageSquare,
	Paperclip,
	GitBranch,
	ArrowRightLeft,
	Lightbulb,
	AlertCircle,
	Bookmark,
} from "lucide-react";
import Badge from "../atoms/Badge";
import Avatar from "../atoms/Avatar";
import { twMerge } from "tailwind-merge";
import type { Task } from "../../types";

interface TaskCardProps {
	task: Task;
	onClick: () => void;
	onMove?: (status: Task["status"]) => void;
	className?: string;
}

const TypeIcon = ({ type }: { type: Task["type"] }) => {
	switch (type) {
		case "Issue":
			return <AlertCircle size={12} className="text-rose-400" />;
		case "Suggestion":
			return <Lightbulb size={12} className="text-amber-400" />;
		case "Bug":
			return <AlertCircle size={12} className="text-rose-500" />;
		default:
			return <Bookmark size={12} className="text-primary" />;
	}
};

const PriorityBadge = ({ priority }: { priority: Task["priority"] }) => {
	const variants: Record<
		Task["priority"],
		"secondary" | "primary" | "warning" | "danger"
	> = {
		Low: "secondary",
		Medium: "primary",
		High: "warning",
		Urgent: "danger",
	};
	return (
		<Badge variant={variants[priority]} size="xs">
			{priority}
		</Badge>
	);
};

const TaskCard: React.FC<TaskCardProps> = ({
	task,
	onClick,
	onMove,
	className,
}) => {
	const handleMove = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onMove) {
			const statuses: Task["status"][] = [
				"Todo",
				"InProgress",
				"InReview",
				"Done",
			];
			const currentIndex = statuses.indexOf(task.status);
			const nextStatus = statuses[(currentIndex + 1) % statuses.length];
			onMove(nextStatus);
		}
	};

	const hasImage = task.attachments?.some((a) => a.type === "image");
	const thumbnail = task.attachments?.find((a) => a.type === "image")?.url;

	return (
		<motion.div
			layoutId={task.id}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.95 }}
			onClick={onClick}
			className={twMerge(
				"glass-card p-3 md:p-4 rounded-xl md:rounded-2xl cursor-grab active:cursor-grabbing group hover:bg-surface-hover/50 mb-2 md:mb-3 relative overflow-hidden",
				className,
			)}
		>
			<button
				onClick={handleMove}
				className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 bg-primary/20 text-primary transition-all hover:bg-primary/40 rounded-bl-xl z-20"
			>
				<ArrowRightLeft size={14} />
			</button>

			{hasImage && thumbnail && (
				<div className="mb-2 md:mb-3 rounded-lg md:rounded-xl overflow-hidden h-24 md:h-32 border border-border">
					<img
						src={thumbnail}
						alt="Thumbnail"
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					/>
				</div>
			)}

			<div className="flex justify-between items-start mb-2 md:mb-3">
				<div className="flex items-center gap-1.5 md:gap-2">
					<TypeIcon type={task.type} />
					<span className="text-[9px] md:text-[10px] font-mono text-text-muted bg-surface px-1.5 py-0.5 rounded border border-border">
						{task.taskId}
					</span>
				</div>
				<PriorityBadge priority={task.priority} />
			</div>

			<h4 className="text-xs md:text-sm font-bold text-text-main mb-3 md:mb-4 line-clamp-2 leading-tight md:leading-snug group-hover:text-primary transition-colors">
				{task.title}
			</h4>

			<div className="flex justify-between items-center">
				<div className="flex items-center -space-x-1.5 md:-space-x-2">
					<Avatar
						name={task.assignee?.name || "Unassigned"}
						size="xs"
						className="border-2 border-background w-5 h-5 md:w-6 md:h-6"
					/>
					{task.hasGithub && (
						<div className="w-5 h-5 md:w-6 md:h-6 rounded-lg border-2 border-background bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_10px_rgba(56,189,248,0.3)] z-10">
							<GitBranch size={10} className="md:w-[12px]" />
						</div>
					)}
				</div>

				<div className="flex items-center gap-2 md:gap-3 text-text-muted">
					<div className="flex items-center gap-1">
						<MessageSquare size={10} className="md:w-[12px]" />
						<span className="text-[9px] md:text-[10px]">
							{task.comments?.length || 0}
						</span>
					</div>
					<div className="flex items-center gap-1">
						<Paperclip size={10} className="md:w-[12px]" />
						<span className="text-[9px] md:text-[10px]">
							{task.attachments?.length || 0}
						</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default TaskCard;
