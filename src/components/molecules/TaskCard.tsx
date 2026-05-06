import React from "react";
import { motion } from "framer-motion";
import {
	MessageSquare,
	Lightbulb,
	AlertCircle,
	Bookmark,
	Calendar,
	CheckCircle2,
	Plus,
} from "lucide-react";
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
	const colors: Record<Task["priority"], string> = {
		Low: "bg-surface text-text-muted border-border",
		Medium: "bg-primary/10 text-primary border-primary/20",
		High: "bg-warning/10 text-warning border-warning/20",
		Urgent: "bg-danger/10 text-danger border-danger/20",
	};

	return (
		<span className={twMerge("px-1.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider", colors[priority])}>
			{priority}
		</span>
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
				"glass-card p-4 cursor-pointer group mb-3 flex flex-col gap-3",
				isOverdue && "border-danger/40 bg-danger/5",
				className,
			)}
		>
			<div className="flex justify-between items-start gap-2">
				<div className="flex items-start gap-2 min-w-0">
					<div className="mt-1 flex-shrink-0">
						<TypeIcon type={task.type} />
					</div>
					<span className="text-sm font-bold text-text-main line-clamp-2 leading-snug group-hover:text-primary transition-colors">
						{task.title}
					</span>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<span className="text-[10px] font-black font-mono text-text-muted bg-surface px-1.5 py-0.5 rounded border border-border">
					{task.taskKey}
				</span>
				<PriorityBadge priority={task.priority} />
			</div>

			<div className="flex justify-between items-center mt-2 pt-3 border-t border-border-subtle">
				<div className="flex items-center -space-x-2">
					{task.taskAssignees && task.taskAssignees.length > 0 ? (
						task.taskAssignees.slice(0, 3).map((ta) => (
							<Avatar
								key={ta.id || ta.userId}
								name={ta.user?.displayName || "Unknown"}
								src={ta.user?.avatarUrl}
								size="xs"
								className="border-2 border-background w-6 h-6 shadow-sm"
							/>
						))
					) : (
						<div className="w-6 h-6 rounded-full border-2 border-dashed border-border flex items-center justify-center text-text-muted">
							<Plus size={10} />
						</div>
					)}
					{task.taskAssignees && task.taskAssignees.length > 3 && (
						<div className="w-6 h-6 rounded-full bg-[var(--accent-primary)]/10 border-2 border-background flex items-center justify-center text-[8px] font-bold text-text-muted">
							+{task.taskAssignees.length - 3}
						</div>
					)}
				</div>

				<div className="flex items-center gap-3 text-text-muted">
					{task.comments && task.comments.length > 0 && (
						<div className="flex items-center gap-1 hover:text-text-main transition-colors">
							<MessageSquare size={12} />
							<span className="text-[10px] font-bold">{task.comments.length}</span>
						</div>
					)}
					{task.dueDate && (
						<div className={twMerge("flex items-center gap-1 text-[10px] font-bold", isOverdue ? "text-danger" : "text-text-muted")}>
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
