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
	Calendar,
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
			return <AlertCircle size={12} className="text-gray-500" />;
		case "Suggestion":
			return <Lightbulb size={12} className="text-gray-400" />;
		case "Bug":
			return <AlertCircle size={12} className="text-gray-600 font-bold" />;
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
				"New",
				"InProgress",
				"ReadyForQA",
				"QAFailed",
				"Developed",
				"Closed",
				"OnHold",
			];
			const currentIndex = statuses.indexOf(task.status);
			const nextStatus = statuses[(currentIndex + 1) % statuses.length];
			onMove(nextStatus);
		}
	};

	// Check if task is overdue
	const isOverdue =
		task.dueDate &&
		new Date(task.dueDate) < new Date() &&
		task.status !== "Closed";

	return (
		<motion.div
			layoutId={task.id}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.95 }}
			onClick={onClick}
			className={twMerge(
				"glass-card p-3 md:p-4 rounded-xl md:rounded-2xl cursor-grab active:cursor-grabbing group hover:bg-surface-hover/50 mb-2 md:mb-3 relative overflow-hidden flex flex-col h-[160px] md:h-[180px]",
				isOverdue && "border-danger/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]",
				className,
			)}
		>
			<button
				onClick={handleMove}
				className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 bg-primary/20 text-primary transition-all hover:bg-primary/40 rounded-bl-xl z-20"
			>
				<ArrowRightLeft size={14} />
			</button>

			<div className="flex justify-between items-start mb-2 md:mb-3">
				<div className="flex items-center gap-1.5 md:gap-2">
					<TypeIcon type={task.type} />
					<span className="text-[9px] md:text-[10px] font-mono text-text-muted bg-surface px-1.5 py-0.5 rounded border border-border">
						{task.taskKey}
					</span>
				</div>
				<PriorityBadge priority={task.priority} />
			</div>

			<div className="flex-1 flex flex-col gap-2 min-w-0">
				<h4 className="text-xs md:text-sm font-bold text-text-main line-clamp-2 leading-tight md:leading-snug group-hover:text-primary transition-colors">
					{task.title}
				</h4>

				<div className="flex items-center gap-2 mt-auto">
					{task.dueDate && (
						<div
							className={twMerge(
								"flex items-center gap-1 text-[9px] md:text-[10px] font-black uppercase tracking-tight px-1.5 py-0.5 rounded border transition-colors",
								isOverdue
									? "text-danger bg-danger/10 border-danger/20"
									: "text-text-muted bg-background border-border",
							)}
						>
							<Calendar size={10} />
							{new Date(task.dueDate).toLocaleDateString(undefined, {
								month: "short",
								day: "numeric",
							})}
						</div>
					)}
				</div>
			</div>

			<div className="flex justify-between items-center mt-auto pt-2 md:pt-3 border-t border-border/30">
				<div className="flex items-center -space-x-1.5 md:-space-x-2">
					{task.taskAssignees && task.taskAssignees.length > 0 ? (
						task.taskAssignees.map((ta) => (
							<Avatar
								key={ta.user.id}
								name={ta.user.displayName}
								src={ta.user.avatarUrl}
								size="xs"
								className="border-2 border-background w-5 h-5 md:w-6 md:h-6"
							/>
						))
					) : (
						<Avatar
							name="Unassigned"
							size="xs"
							className="border-2 border-background w-5 h-5 md:w-6 md:h-6"
						/>
					)}
					{!!task.branchName && (
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
