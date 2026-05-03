import React from "react";
import { motion } from "framer-motion";
import {
	MessageSquare,
	Paperclip,
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
				"bg-white dark:bg-gray-950 border border-gray-200/60 dark:border-white/5 p-4 rounded-xl cursor-pointer group hover:border-gray-900 dark:hover:border-white/20 hover:shadow-md transition-all duration-200 mb-3 flex flex-col gap-3 min-h-[140px]",
				isOverdue && "border-red-500/20 bg-red-50/10 dark:bg-red-500/5",
				className,
			)}
		>
			<div className="flex justify-between items-start">
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
						<TypeIcon type={task.type} />
						<span className="text-[10px] font-mono font-medium text-gray-500 dark:text-gray-400">
							{task.taskKey}
						</span>
					</div>
				</div>
				<PriorityBadge priority={task.priority} />
			</div>

			<div className="flex-1 min-w-0">
				<h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">
					{task.title}
				</h4>
			</div>

			<div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-white/5">
				<div className="flex items-center -space-x-2">
					{task.taskAssignees && task.taskAssignees.length > 0 ? (
						task.taskAssignees
							.map((ta) => (
								<Avatar
									key={ta.id || ta.userId}
									name={ta.user?.displayName || "Unknown"}
									src={ta.user?.avatarUrl}
									size="xs"
									className="border-2 border-white dark:border-gray-950 w-6 h-6"
								/>
							))
					) : (
						<div className="w-6 h-6 rounded-full border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-400">
							<span className="text-[8px]">?</span>
						</div>
					)}
				</div>

				<div className="flex items-center gap-3 text-gray-400 dark:text-gray-500">
					{task.comments && task.comments.length > 0 && (
						<div className="flex items-center gap-1">
							<MessageSquare size={12} />
							<span className="text-[10px] font-medium">
								{task.comments.length}
							</span>
						</div>
					)}
					{task.attachments && task.attachments.length > 0 && (
						<div className="flex items-center gap-1">
							<Paperclip size={12} />
							<span className="text-[10px] font-medium">
								{task.attachments.length}
							</span>
						</div>
					)}
					{task.dueDate && (
						<div
							className={twMerge(
								"flex items-center gap-1 text-[10px] font-medium",
								isOverdue ? "text-red-500" : "text-gray-400 dark:text-gray-500",
							)}
						>
							<Calendar size={12} />
							<span>
								{new Date(task.dueDate).toLocaleDateString(undefined, {
									month: "short",
									day: "numeric",
								})}
							</span>
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
};

export default TaskCard;
