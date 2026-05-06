import React from "react";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";
import type { Task } from "../../types";

interface BacklogTabProps {
	tasks: Task[];
	onSelectTask: (task: Task) => void;
	onAddTask: () => void;
}

const BacklogTab: React.FC<BacklogTabProps> = ({
	tasks,
	onSelectTask,
	onAddTask,
}) => {
	return (
		<motion.div
			key="backlog"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="h-full bg-surface/30 border border-primary/30 rounded-md overflow-hidden flex flex-col"
		>
			<div className="p-4 bg-[var(--accent-primary)]/10 border-b border-primary/30 flex items-center justify-between">
				<span className="text-xs font-bold uppercase text-text-muted">
					Filtered Issues
				</span>
				<div className="flex gap-2">
					<div className="relative">
						<Search
							size={14}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
						/>
						<input
							type="text"
							placeholder="Filter tasks..."
							className="bg-background border border-primary/30 rounded pl-9 pr-3 py-1.5 text-xs text-text-main outline-none focus:border-primary w-64"
						/>
					</div>
					<Button
						variant="success"
						size="xs"
						leftIcon={<Plus size={14} />}
						onClick={onAddTask}
					>
						Add Task
					</Button>
				</div>
			</div>
			<div className="flex-1 overflow-y-auto p-4 space-y-2 bg-background/50">
				{tasks.map((task) => (
					<div
						key={task.id}
						onClick={() => onSelectTask(task)}
						className="p-3 bg-surface border border-primary/30 rounded hover:border-text-muted transition-colors flex items-center justify-between group cursor-pointer"
					>
						<div className="flex items-center gap-3">
							<div
								className={`w-2 h-2 rounded-full ${task.type === "Bug" ? "bg-primary" : task.type === "Issue" ? "bg-primary" : "bg-primary"}`}
							/>
							<span className="text-sm font-medium text-text-main">
								{task.title}
							</span>
						</div>
						<div className="flex items-center gap-4">
							<span className="text-[10px] font-mono text-text-muted">
								{task.taskKey}
							</span>
							<div className="flex -space-x-2">
								{task.taskAssignees?.map((assignee) => (
									<Avatar
										key={assignee.user?.id}
										name={assignee.user?.displayName}
										src={assignee.user?.avatarUrl}
										size="xs"
									/>
								))}
							</div>
						</div>
					</div>
				))}
			</div>
		</motion.div>
	);
};

export default BacklogTab;
