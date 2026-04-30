import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
	Plus,
	Layout,
	List as ListIcon,
	Calendar as CalendarIcon,
	Users as UsersIcon,
	Settings,
	ChevronDown,
	Target,
} from "lucide-react";
import TaskCard from "../components/molecules/TaskCard";
import TaskDetailModal from "../components/organisms/TaskDetailModal";
import TaskFormModal from "../components/organisms/TaskFormModal";
import ProjectFormModal from "../components/organisms/ProjectFormModal";
import SprintFormModal from "../components/organisms/SprintFormModal";
import Button from "../components/atoms/Button";
import Avatar from "../components/atoms/Avatar";
import PageHeader from "../components/molecules/PageHeader";
import ColumnHeader from "../components/molecules/ColumnHeader";
import SprintSelector from "../components/molecules/SprintSelector";
import type { Task, Sprint, Project } from "../types";
import { useProject } from "../hooks/useProject";
import { useToast } from "../hooks/useToast";
import LoadingScreen from "../components/organisms/LoadingScreen";
import { MOCK_SPRINTS, MOCK_PROJECTS } from "../mocks/data";

const columns = [
	{ id: "Todo", title: "To Do", color: "border-slate-500" },
	{ id: "InProgress", title: "In Progress", color: "border-primary" },
	{ id: "InReview", title: "In Review", color: "border-accent-purple" },
	{ id: "Done", title: "Done", color: "border-success" },
];

type ViewTab = "Board" | "Backlog" | "Timeline" | "Team" | "Settings";

const Board: React.FC = () => {
	const { projectId } = useParams<{ projectId: string }>();
	const navigate = useNavigate();
	const { tasks, loading, fetchTasks, moveTask } = useProject();
	const { success } = useToast();

	const [activeTab, setActiveTab] = useState<ViewTab>("Board");
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
	const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
	const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
	const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);

	const currentProject =
		MOCK_PROJECTS.find((p) => p.id === projectId) || MOCK_PROJECTS[0];

	useEffect(() => {
		fetchTasks(projectId || "1");
	}, [fetchTasks, projectId]);

	const handleMoveTask = async (taskId: string, newStatus: Task["status"]) => {
		await moveTask(taskId, newStatus);
		success("Task Moved", `Task status updated to ${newStatus}.`);
	};

	const handleAddTask = () => {
		setEditingTask(null);
		setIsTaskModalOpen(true);
	};

	const handleSaveTask = (data: Partial<Task>) => {
		success(
			"Action Successful",
			editingTask ? "Task updated." : "New task created.",
		);
		setIsTaskModalOpen(false);
		// If the task was created for a different project, we might want to navigate there
		if (!editingTask && data.projectId && data.projectId !== projectId) {
			navigate(`/project/${data.projectId}`);
		}
	};

	const handleCreateProject = (data: Partial<Project>) => {
		success("Workspace Ready", `Project "${data.name}" has been initialized.`);
		setIsProjectModalOpen(false);
	};

	const handleCreateSprint = (data: Partial<Sprint>) => {
		success(
			"Sprint Launched",
			`Sprint "${data.name}" is now the active focus.`,
		);
		setIsSprintModalOpen(false);
	};

	if (loading && tasks.length === 0) {
		return <LoadingScreen />;
	}

	return (
		<div className="h-full flex flex-col space-y-6 pb-10 overflow-hidden">
			<TaskDetailModal
				isOpen={!!selectedTask}
				onClose={() => setSelectedTask(null)}
				task={selectedTask || ({} as Task)}
			/>

			<TaskFormModal
				key={editingTask?.id || "new-task"}
				isOpen={isTaskModalOpen}
				onClose={() => setIsTaskModalOpen(false)}
				task={editingTask}
				onSave={handleSaveTask}
			/>

			<ProjectFormModal
				isOpen={isProjectModalOpen}
				onClose={() => setIsProjectModalOpen(false)}
				onSave={handleCreateProject}
			/>

			<SprintFormModal
				isOpen={isSprintModalOpen}
				onClose={() => setIsSprintModalOpen(false)}
				onSave={handleCreateSprint}
			/>

			<PageHeader
				title={
					<div className="relative">
						<button
							onClick={() => setIsProjectSelectorOpen(!isProjectSelectorOpen)}
							className="flex items-center gap-2 hover:bg-surface-hover px-2 py-1 -ml-2 rounded-md transition-all group"
						>
							<span>{currentProject.name}</span>
							<ChevronDown
								size={18}
								className={`text-text-muted group-hover:text-text-main transition-transform ${isProjectSelectorOpen ? "rotate-180" : ""}`}
							/>
						</button>

						{/* Project Switcher Dropdown */}
						<AnimatePresence>
							{isProjectSelectorOpen && (
								<>
									<div
										className="fixed inset-0 z-40"
										onClick={() => setIsProjectSelectorOpen(false)}
									/>
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: 10 }}
										className="absolute top-full left-0 mt-2 w-72 bg-surface border border-border rounded-md shadow-2xl z-50 overflow-hidden"
									>
										<div className="p-2 border-b border-border bg-surface-hover">
											<span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
												Switch Workspace
											</span>
										</div>
										<div className="max-h-64 overflow-y-auto p-1 bg-background">
											{MOCK_PROJECTS.map((p) => (
												<button
													key={p.id}
													onClick={() => {
														navigate(`/project/${p.id}`);
														setIsProjectSelectorOpen(false);
													}}
													className={`w-full flex items-center gap-3 p-3 rounded-md transition-all ${p.id === projectId ? "bg-primary/10 border border-primary/20" : "hover:bg-surface border border-transparent"}`}
												>
													<div
														className={`w-8 h-8 rounded flex items-center justify-center ${p.id === projectId ? "bg-primary text-white" : "bg-surface border border-border text-text-muted"}`}
													>
														<Target size={16} />
													</div>
													<div className="text-left">
														<p
															className={`text-xs font-bold ${p.id === projectId ? "text-primary" : "text-text-main"}`}
														>
															{p.name}
														</p>
														<p className="text-[10px] text-text-muted uppercase">
															{p.key}
														</p>
													</div>
												</button>
											))}
										</div>
										<button
											onClick={() => {
												setIsProjectModalOpen(true);
												setIsProjectSelectorOpen(false);
											}}
											className="w-full p-3 border-t border-border text-xs font-bold text-primary hover:bg-surface-hover transition-all flex items-center justify-center gap-2"
										>
											<Plus size={14} />
											Initialize New Workspace
										</button>
									</motion.div>
								</>
							)}
						</AnimatePresence>
					</div>
				}
				description={
					<div className="flex items-center gap-3">
						<span className="text-text-muted">
							{currentProject.description}
						</span>
						<span className="w-1 h-1 rounded-full bg-border"></span>
						<span className="font-mono text-[10px] text-text-muted bg-surface px-1.5 py-0.5 rounded border border-border uppercase">
							{currentProject.key}
						</span>
					</div>
				}
				actions={
					<div className="flex items-center justify-between w-full md:w-auto gap-6">
						<div onClick={() => setIsSprintModalOpen(true)}>
							<SprintSelector activeSprint={MOCK_SPRINTS[0]} />
						</div>

						<div className="flex -space-x-2">
							{[1, 2, 3, 4].map((i) => (
								<Avatar
									key={i}
									name={`Team Member ${i}`}
									size="sm"
									className="border-2 border-background hover:z-10 transition-all"
									isClickable
								/>
							))}
							<button
								onClick={() => setIsProjectModalOpen(true)}
								className="w-8 h-8 rounded-full border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text-main transition-all"
							>
								<Plus size={16} />
							</button>
						</div>
						<Button
							onClick={handleAddTask}
							variant="primary"
							size="sm"
							leftIcon={<Plus size={18} />}
						>
							Add Task
						</Button>
					</div>
				}
			/>

			{/* Navigation Tabs */}
			<div className="flex items-center gap-1 border-b border-border bg-surface-hover/30 px-2 rounded-t-md">
				{(
					["Board", "Backlog", "Timeline", "Team", "Settings"] as ViewTab[]
				).map((tab) => {
					const Icon = {
						Board: Layout,
						Backlog: ListIcon,
						Timeline: CalendarIcon,
						Team: UsersIcon,
						Settings: Settings,
					}[tab];

					return (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-all relative border-b-2 ${
								activeTab === tab
									? "border-primary text-text-main"
									: "border-transparent text-text-muted hover:text-text-main hover:bg-surface-hover/50"
							}`}
						>
							<Icon size={14} />
							{tab}
							{tab === "Backlog" && (
								<span className="ml-1 px-1.5 py-0.5 rounded-full bg-surface border border-border text-[9px]">
									{tasks.length}
								</span>
							)}
						</button>
					);
				})}
			</div>

			<div className="flex-1 overflow-hidden">
				<AnimatePresence mode="wait">
					{activeTab === "Board" && (
						<motion.div
							key="board"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							className="h-full flex gap-6 overflow-x-auto pb-4 scrollbar-custom min-h-0"
						>
							{columns.map((col) => (
								<div key={col.id} className="flex-shrink-0 w-80 flex flex-col">
									<ColumnHeader
										title={col.title}
										colorClass={col.color}
										count={tasks.filter((t) => t.status === col.id).length}
										onAdd={handleAddTask}
									/>

									<div className="flex-1 bg-surface/30 rounded-md p-2 min-h-0 overflow-y-auto scrollbar-custom space-y-1 border border-border">
										{tasks
											.filter((task) => task.status === col.id)
											.map((task) => (
												<TaskCard
													key={task.id}
													task={task}
													onClick={() => setSelectedTask(task)}
													onMove={(newStatus) =>
														handleMoveTask(task.id, newStatus)
													}
												/>
											))}
									</div>
								</div>
							))}
						</motion.div>
					)}

					{activeTab === "Backlog" && (
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
					)}

					{activeTab === "Timeline" && (
						<motion.div
							key="timeline"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							className="h-full bg-surface/30 border border-border rounded-md p-12 flex flex-col items-center justify-center text-center space-y-4"
						>
							<div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted">
								<CalendarIcon size={32} />
							</div>
							<div>
								<h3 className="font-bold text-text-main">Project Roadmap</h3>
								<p className="text-sm text-text-muted mt-2 max-w-sm">
									The interactive timeline view is currently synchronizing with
									the {currentProject.key} milestones.
								</p>
							</div>
							<Button variant="secondary">View Full Calendar</Button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default Board;
