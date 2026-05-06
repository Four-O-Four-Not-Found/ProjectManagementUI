import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	Calendar as CalendarIcon,
	Plus,
	GripVertical,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import Button from "../atoms/Button";
import type { Task } from "../../types";
import { twMerge } from "tailwind-merge";

interface TimelineTabProps {
	tasks: Task[];
	onAddTask: () => void;
	onUpdateTaskDates?: (
		taskId: string,
		startDate: string,
		endDate: string,
	) => void;
}

const TimelineTab: React.FC<TimelineTabProps> = ({
	tasks,
	onAddTask,
	onUpdateTaskDates,
}) => {
	const [viewMode, setViewMode] = useState<"Weeks" | "Months">("Weeks");

	const days = Array.from({ length: 30 }, (_, i) => {
		const d = new Date();
		d.setDate(d.getDate() + i);
		return d;
	});

	const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

	const handleDragStart = (
		e: React.DragEvent<HTMLDivElement>,
		taskId: string,
	) => {
		setDraggingTaskId(taskId);
		e.dataTransfer.setData("taskId", taskId);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>, dayIndex: number) => {
		e.preventDefault();
		const taskId = e.dataTransfer.getData("taskId");
		if (taskId && onUpdateTaskDates) {
			const newStart = days[dayIndex].toISOString();
			const newEnd = new Date(days[dayIndex]);
			newEnd.setDate(newEnd.getDate() + 3); // Default 3-day duration
			onUpdateTaskDates(taskId, newStart, newEnd.toISOString());
			setDraggingTaskId(null);
		}
	};

	return (
		<motion.div
			key="timeline"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="h-full bg-surface/30 border border-border rounded-md overflow-hidden flex flex-col"
		>
			<div className="p-4 border-b border-border bg-[var(--accent-primary)]/10 flex justify-between items-center shrink-0">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-primary/10 rounded-lg text-primary">
						<CalendarIcon size={18} />
					</div>
					<div>
						<h3 className="font-bold text-text-main text-xs uppercase tracking-wider">
							Interactive Gantt Scheduler
						</h3>
						<p className="text-[10px] text-text-muted">
							Drag bars to reschedule tasks
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<div className="flex bg-background border border-border rounded-lg p-1 mr-4">
						{(["Weeks", "Months"] as const).map((mode) => (
							<button
								key={mode}
								onClick={() => setViewMode(mode)}
								className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${
									viewMode === mode
										? "bg-primary text-[var(--text-primary)]"
										: "text-text-muted hover:text-text-main"
								}`}
							>
								{mode}
							</button>
						))}
					</div>
					<Button variant="secondary" size="xs" leftIcon={<Plus size={14} />}>
						Add Milestone
					</Button>
				</div>
			</div>

			<div className="flex-1 overflow-hidden flex flex-col">
				<div className="flex border-b border-border bg-background/50 overflow-hidden shrink-0">
					<div className="w-64 border-r border-border p-3 shrink-0 flex items-center justify-between">
						<span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
							Task Definition
						</span>
						<div className="flex gap-1">
							<button className="p-1 hover:bg-surface rounded text-text-muted">
								<ChevronLeft size={14} />
							</button>
							<button className="p-1 hover:bg-surface rounded text-text-muted">
								<ChevronRight size={14} />
							</button>
						</div>
					</div>
					<div className="flex-1 overflow-x-auto scrollbar-hide flex">
						{days.map((day, i) => (
							<div
								key={i}
								onDragOver={(e) => e.preventDefault()}
								onDrop={(e) => handleDrop(e, i)}
								className="w-20 shrink-0 border-r border-border/30 p-2 flex flex-col items-center justify-center bg-[var(--accent-primary)]/10"
							>
								<span className="text-[8px] font-bold text-text-muted uppercase">
									{day.toLocaleDateString(undefined, { weekday: "short" })}
								</span>
								<span className="text-xs font-black text-text-main">
									{day.getDate()}
								</span>
							</div>
						))}
					</div>
				</div>

				<div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-custom bg-background/20">
					{tasks.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-64 text-center opacity-50">
							<CalendarIcon size={40} className="text-text-muted mb-4" />
							<p className="text-sm font-bold text-text-main">
								No tasks in repository
							</p>
							<p className="text-xs text-text-muted">
								Start by adding tasks to your board.
							</p>
						</div>
					) : (
						tasks.map((task, idx) => (
							<div
								key={task.id}
								className="flex border-b border-border/30 group hover:bg-[var(--accent-primary)]/10 transition-colors"
							>
								<div className="w-64 border-r border-border p-3 shrink-0 flex items-center gap-3">
									<div
										className={`w-1.5 h-1.5 rounded-full ${task.priority === "Urgent" ? "bg-danger" : "bg-primary"}`}
									/>
									<div className="min-w-0">
										<p className="text-[11px] font-bold text-text-main truncate">
											{task.title}
										</p>
										<p className="text-[9px] text-text-muted font-mono">
											{task.taskKey}
										</p>
									</div>
								</div>
								<div className="flex-1 relative h-14 flex items-center overflow-x-auto scrollbar-hide">
									<motion.div
										draggable
										onDragStart={(e) =>
											handleDragStart(
												e as unknown as React.DragEvent<HTMLDivElement>,
												task.id,
											)
										}
										layoutId={`gantt-${task.id}`}
										className={twMerge(
											"absolute h-8 rounded-lg border flex items-center px-3 cursor-grab active:cursor-grabbing shadow-lg group-hover:shadow-primary/20 transition-shadow",
											task.status === "Done"
												? "bg-success/20 border-success/40"
												: "bg-primary/20 border-primary/40",
											draggingTaskId === task.id && "opacity-50 scale-95",
										)}
										style={{
											left: `${(idx % 10) * 80 + 20}px`,
											width: "240px",
										}}
									>
										<GripVertical
											size={12}
											className="text-text-muted mr-2 shrink-0"
										/>
										<span className="text-[10px] font-black text-text-main truncate">
											{task.status}
										</span>
										<div className="ml-auto flex -space-x-1">
											<div className="w-4 h-4 rounded-full bg-background border border-border" />
										</div>
									</motion.div>
								</div>
							</div>
						))
					)}
				</div>
			</div>

			<div className="p-4 bg-[var(--accent-primary)]/10 border-t border-border flex items-center justify-between shrink-0">
				<div className="flex items-center gap-6">
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/40" />
						<span className="text-[10px] text-text-muted uppercase font-bold">
							Planned
						</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 rounded-sm bg-success/20 border border-success/40" />
						<span className="text-[10px] text-text-muted uppercase font-bold">
							Completed
						</span>
					</div>
				</div>
				<Button variant="primary" size="xs" onClick={onAddTask}>
					Create Entry
				</Button>
			</div>
		</motion.div>
	);
};

export default TimelineTab;
