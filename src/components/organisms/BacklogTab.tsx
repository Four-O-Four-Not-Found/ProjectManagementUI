import React from "react";
import { motion } from "framer-motion";
import Avatar from "../atoms/Avatar";
import type { Task } from "../../types";

interface BacklogTabProps {
	tasks: Task[];
	onSelectTask: (task: Task) => void;
}

const BacklogTab: React.FC<BacklogTabProps> = ({ tasks, onSelectTask }) => {
	return (
		<motion.div
			key="backlog"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="h-full bg-surface/30 border border-border rounded-md overflow-hidden flex flex-col"
		>
			<div className="p-4 bg-surface-hover border-b border-border flex items-center justify-between">
				<span className="text-xs font-bold uppercase text-text-muted">
					Filtered Issues
				</span>
				<div className="flex gap-2">
					<input
						type="text"
						placeholder="Filter tasks..."
						className="bg-background border border-border rounded px-3 py-1.5 text-xs text-text-main outline-none focus:border-primary w-64"
					/>
				</div>
			</div>
			<div className="flex-1 overflow-y-auto p-4 space-y-2 bg-background/50">
				{tasks.map((task) => (
					<div
						key={task.id}
						onClick={() => onSelectTask(task)}
						className="p-3 bg-surface border border-border rounded hover:border-text-muted transition-colors flex items-center justify-between group cursor-pointer"
					>
						<div className="flex items-center gap-3">
							<div
								className={`w-2 h-2 rounded-full ${task.type === "Bug" ? "bg-danger" : task.type === "Issue" ? "bg-warning" : "bg-success"}`}
							/>
							<span className="text-sm font-medium text-text-main">
								{task.title}
							</span>
						</div>
						<div className="flex items-center gap-4">
							<span className="text-[10px] font-mono text-text-muted">
								{task.taskId}
							</span>
							<Avatar name={task.assignee?.name} size="xs" />
						</div>
					</div>
				))}
			</div>
		</motion.div>
	);
};

export default BacklogTab;
