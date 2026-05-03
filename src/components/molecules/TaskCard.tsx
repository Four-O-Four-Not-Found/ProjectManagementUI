import React from "react";
import { motion } from "framer-motion";
import {
	MessageSquare,
	Lightbulb,
	AlertCircle,
	Bookmark,
	Calendar,
	CheckCircle2,
} from "lucide-react";
import Badge from "../atoms/Badge";
import Avatar from "../atoms/Avatar";
import { twMerge } from "tailwind-merge";
import type { Task } from "../../types";

interface TaskCardProps {
	task: Task;
	onClick: () => void;
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
		case "Feature":
			return <CheckCircle2 size={12} className="text-gray-900" />;
		default:
			return <Bookmark size={12} className="text-gray-900" />;
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
	className,
}) => {
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
				"bg-[var(--surface)] border border-[var(--border)] p-3 rounded-github cursor-pointer group hover:border-[var(--text-muted)] transition-all duration-200 mb-3 flex flex-col gap-2 min-h-[100px]",
				isOverdue && "border-[#da3633]/40 bg-[#da3633]/5",
				className,
			)}
		>
			<div className="flex justify-between items-start">
				<div className="flex items-center gap-1.5 min-w-0">
					<TypeIcon type={task.type} />
					<span className="text-[12px] font-semibold text-[var(--text-main)] truncate group-hover:text-[var(--color-primary)] transition-colors">
						{task.title}
					</span>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<span className="text-[11px] font-mono text-[var(--text-muted)]">
					{task.taskKey}
				</span>
				<PriorityBadge priority={task.priority} />
			</div>

			<div className="flex justify-between items-center mt-1">
				<div className="flex items-center -space-x-1">
					{task.taskAssignees && task.taskAssignees.length > 0 ? (
						task.taskAssignees.slice(0, 3).map((ta) => (
							<Avatar
								key={ta.id || ta.userId}
								name={ta.user?.displayName || "Unknown"}
								src={ta.user?.avatarUrl}
								size="xs"
								className="border-2 border-[var(--surface)] w-5 h-5"
							/>
						))
					) : null}
					{task.taskAssignees && task.taskAssignees.length > 3 && (
						<div className="w-5 h-5 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[8px] text-[var(--text-muted)]">
							+{task.taskAssignees.length - 3}
						</div>
					)}
				</div>

				<div className="flex items-center gap-3 text-[var(--text-muted)]">
					{task.comments && task.comments.length > 0 && (
						<div className="flex items-center gap-1">
							<MessageSquare size={12} />
							<span className="text-[10px]">{task.comments.length}</span>
						</div>
					)}
					{task.dueDate && (
						<div className={twMerge("flex items-center gap-1 text-[10px]", isOverdue && "text-[#da3633]")}>
							<Calendar size={12} />
							<span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
};

export default TaskCard;
