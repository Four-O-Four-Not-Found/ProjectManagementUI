import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
	Plus,
	Layout,
	List as ListIcon,
	Calendar as CalendarIcon,
	Users as UsersIcon,
	Settings as SettingsIcon,
	ChevronDown,
	Target,
	GitBranch,
	Clock,
	Sparkles,
} from "lucide-react";
import TaskCard from "../components/molecules/TaskCard";
import TaskDetailModal from "../components/organisms/TaskDetailModal";
import TaskFormModal from "../components/organisms/TaskFormModal";
import ProjectFormModal from "../components/organisms/ProjectFormModal";
import SprintFormModal from "../components/organisms/SprintFormModal";
import RepositoryTab from "../components/organisms/RepositoryTab";
import BacklogTab from "../components/organisms/BacklogTab";
import TeamTab from "../components/organisms/TeamTab";
import TimelineTab from "../components/organisms/TimelineTab";
import SprintsTab from "../components/organisms/SprintsTab";
import SettingsTab from "../components/organisms/SettingsTab";
import AIPredictor from "../components/molecules/AIPredictor";
import Button from "../components/atoms/Button";
import Avatar from "../components/atoms/Avatar";
import PageHeader from "../components/molecules/PageHeader";
import ColumnHeader from "../components/molecules/ColumnHeader";
import SprintSelector from "../components/molecules/SprintSelector";
import type { Task, Sprint, Project } from "../types";
import { useProject } from "../hooks/useProject";
import { useToast } from "../hooks/useToast";
import LoadingScreen from "../components/organisms/LoadingScreen";
import { projectService } from "../services/projectService";
import teamService, { type Team } from "../services/teamService";
import { twMerge } from "tailwind-merge";

const columns = [
	{ id: "Todo", title: "To Do", color: "border-slate-500" },
	{ id: "InProgress", title: "In Progress", color: "border-primary" },
	{ id: "InReview", title: "In Review", color: "border-accent-purple" },
	{ id: "Done", title: "Done", color: "border-success" },
];

type ViewTab =
	| "Board"
	| "Backlog"
	| "Sprints"
	| "Timeline"
	| "Team"
	| "Repository"
	| "Settings";

const Board: React.FC = () => {
	const { projectId } = useParams<{ projectId: string }>();
	const navigate = useNavigate();
	const { tasks, loading, fetchTasks, moveTask, assignTask } = useProject();
	const { success, error } = useToast();

	const [activeTab, setActiveTab] = useState<ViewTab>("Board");
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
	const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
	const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
	const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const [expandedColumn, setExpandedColumn] = useState<string | null>(null);
	const [showAI, setShowAI] = useState(false);

	const [currentProject, setCurrentProject] = useState<Project | null>(null);
	const [allProjects, setAllProjects] = useState<Project[]>([]);
	const [projectTeam, setProjectTeam] = useState<Team | null>(null);
	const [sprints, setSprints] = useState<Sprint[]>([]);
	const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
	const [isInitializing, setIsInitializing] = useState(true);

	useEffect(() => {
		if (activeTab === "Team" && currentProject?.teamId) {
			teamService
				.getTeam(currentProject.teamId)
				.then(setProjectTeam)
				.catch(console.error);
		}
	}, [activeTab, currentProject?.teamId]);

	const handleRoleChange = async (profileId: string, newRole: string) => {
		if (!currentProject?.teamId) return;
		try {
			await teamService.updateMemberRole(
				currentProject.teamId,
				profileId,
				newRole,
			);
			success("Role Updated", "Member role has been changed for this project.");
			setProjectTeam((prev) => {
				if (!prev) return prev;
				return {
					...prev,
					members: prev.members?.map((m) =>
						m.profileId === profileId ? { ...m, role: newRole } : m,
					),
				};
			});
		} catch {
			error("Update Failed", "Could not change member role.");
		}
	};

	const handleAssignTask = async (taskId: string, profileId: string) => {
		await assignTask(taskId, profileId);
		success("Task Assigned", "You are now responsible for this task.");
		setSelectedTask(null);
	};

	useEffect(() => {
		let isMounted = true;

		if (projectId) {
			Promise.all([
				projectService
					.getProjectBoard(projectId)
					.then((p) => isMounted && setCurrentProject(p)),
				projectService
					.getProjects()
					.then((p) => isMounted && setAllProjects(p)),
				projectService.getSprints(projectId).then((s) => {
					if (isMounted) {
						setSprints(s);
						const active =
							s.find((sp) => sp.status === "Active") || s[0] || null;
						setActiveSprint(active);
					}
				}),
			])
				.catch((err) => {
					console.error("Board Initialization Error:", err);
					if (isMounted) {
						error("Sync Failed", "Could not connect to the workspace API.");
						setIsInitializing(false);
					}
				})
				.finally(() => {
					if (isMounted) setIsInitializing(false);
				});
			fetchTasks(projectId);
		} else {
			projectService
				.getProjects()
				.then((projects) => {
					if (!isMounted) return;
					if (projects.length > 0) {
						navigate(`/project/${projects[0].id}`, { replace: true });
					} else {
						// If no projects, stop loading so user can see "Create Project" UI
						setIsInitializing(false);
						navigate(`/`, { replace: true });
					}
				})
				.catch(() => {
					if (isMounted) setIsInitializing(false);
				});
		}

		return () => {
			isMounted = false;
			setCurrentProject(null);
			setIsInitializing(true);
		};
	}, [fetchTasks, projectId, navigate, error]);

	const handleMoveTask = async (taskId: string, newStatus: Task["status"]) => {
		await moveTask(taskId, newStatus);
		success("Task Moved", `Task status updated to ${newStatus}.`);
	};

	const handleAddTask = useCallback(() => {
		setEditingTask(null);
		setIsTaskModalOpen(true);
	}, []);

	const handleSaveTask = (data: Partial<Task>) => {
		success(
			"Action Successful",
			editingTask ? "Task updated." : "New task created.",
		);
		setIsTaskModalOpen(false);
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
		if (projectId) projectService.getSprints(projectId).then(setSprints);
	};

	if ((loading && tasks.length === 0) || isInitializing || (projectId && !currentProject)) {
		return <LoadingScreen />;
	}

	return (
		<div className="h-full flex flex-col space-y-4 md:space-y-6 pb-10 overflow-hidden relative">
			<TaskDetailModal
				isOpen={!!selectedTask}
				onClose={() => setSelectedTask(null)}
				task={selectedTask || ({} as Task)}
				onAssign={handleAssignTask}
			/>

			<TaskFormModal
				key={editingTask?.id || "new-task"}
				isOpen={isTaskModalOpen}
				onClose={() => setIsTaskModalOpen(false)}
				task={editingTask}
				onSave={handleSaveTask}
				gitHubRepo={currentProject?.gitHubRepo}
				defaultProjectId={projectId}
				projects={allProjects}
				teamMembers={projectTeam?.members || []}
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
							<span className="font-black tracking-tight text-xl md:text-2xl">
								{currentProject.name}
							</span>
							<ChevronDown
								size={18}
								className={`text-text-muted group-hover:text-text-main transition-transform ${isProjectSelectorOpen ? "rotate-180" : ""}`}
							/>
						</button>

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
											{allProjects.map((p) => (
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
														<p className="text-[10px] text-text-muted uppercase font-mono">
															{p.key}
														</p>
													</div>
												</button>
											))}
										</div>
									</motion.div>
								</>
							)}
						</AnimatePresence>
					</div>
				}
				description={
					<div className="flex flex-wrap items-center gap-2 md:gap-3">
						<span className="hidden md:inline text-text-muted font-medium text-sm">
							{currentProject.description}
						</span>
						<span className="hidden md:inline w-1 h-1 rounded-full bg-border"></span>
						<span className="font-black text-[10px] text-text-muted bg-surface px-1.5 py-0.5 rounded border border-border uppercase tracking-widest">
							{currentProject.key}
						</span>
						<span className="w-1 h-1 rounded-full bg-border"></span>
						<span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">
							{new Date().toLocaleDateString(undefined, {
								month: "short",
								day: "numeric",
							})}
						</span>
					</div>
				}
				actions={
					<div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-6 mt-2 md:mt-0">
						<div className="relative group">
							<button onClick={() => setIsSprintModalOpen(true)}>
								<SprintSelector activeSprint={activeSprint || ({} as Sprint)} />
							</button>
						</div>

						<div className="flex -space-x-2">
							{projectTeam?.members?.slice(0, 5).map((member) => (
								<Avatar
									key={member.profileId}
									name={member.name}
									size="sm"
									className="border-2 border-background hover:z-10 transition-all shadow-md"
								/>
							))}
							{projectTeam?.members && projectTeam.members.length > 5 && (
								<div className="w-8 h-8 rounded-full bg-surface border-2 border-background flex items-center justify-center text-[10px] font-black text-text-muted hover:z-10 transition-all shadow-md">
									+{projectTeam.members.length - 5}
								</div>
							)}
						</div>
						<Button
							onClick={handleAddTask}
							variant="primary"
							size="sm"
							className="px-6 md:px-4"
							leftIcon={<Plus size={18} />}
						>
							<span className="hidden md:inline">Add Task</span>
							<span className="md:hidden">Add</span>
						</Button>
					</div>
				}
			/>

			{/* Navigation Tabs - Sticky */}
			<div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-2 rounded-t-md shrink-0">
				<div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
					{(
						[
							"Board",
							"Backlog",
							"Sprints",
							"Timeline",
							"Team",
							"Repository",
							"Settings",
						] as ViewTab[]
					).map((tab) => {
						const Icon = {
							Board: Layout,
							Backlog: ListIcon,
							Sprints: CalendarIcon,
							Timeline: Clock,
							Team: UsersIcon,
							Repository: GitBranch,
							Settings: SettingsIcon,
						}[tab];

						return (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`flex items-center gap-2 px-3 md:px-4 py-3 text-xs font-semibold transition-all relative border-b-2 whitespace-nowrap ${
									activeTab === tab
										? "border-primary text-text-main"
										: "border-transparent text-text-muted hover:text-text-main hover:bg-surface-hover/50"
								}`}
							>
								<Icon size={14} />
								<span
									className={twMerge(activeTab !== tab && "hidden md:inline")}
								>
									{tab}
								</span>
								{tab === "Backlog" && (
									<span className="ml-1 px-1 py-0.5 rounded-full bg-surface border border-border text-[8px] font-bold">
										{tasks.length}
									</span>
								)}
							</button>
						);
					})}
				</div>

				{activeTab === "Board" && (
					<button
						onClick={() => setShowAI(!showAI)}
						className={twMerge(
							"flex items-center justify-center w-8 h-8 md:w-auto md:h-auto md:px-3 md:py-1.5 rounded-lg transition-all mr-2",
							showAI
								? "bg-primary text-white shadow-[0_0_15px_rgba(56,189,248,0.4)]"
								: "bg-surface border border-border text-text-muted hover:text-primary hover:border-primary/50",
						)}
					>
						<Sparkles size={14} className={showAI ? "animate-pulse" : ""} />
						<span className="hidden md:inline ml-2 text-[10px] font-black uppercase tracking-widest">
							AI Insights
						</span>
					</button>
				)}
			</div>

			<div className="flex-1 overflow-hidden px-2 md:px-0 flex gap-6">
				<div className="flex-1 overflow-hidden">
					<AnimatePresence mode="wait">
						{activeTab === "Board" && (
							<motion.div
								key="board"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								className="h-full grid grid-cols-2 md:flex gap-3 md:gap-6 overflow-y-auto md:overflow-x-auto pb-4 scrollbar-custom min-h-0"
							>
								{columns.map((col) => (
									<div
										key={col.id}
										className={twMerge(
											"flex flex-col min-w-0 md:w-80 md:flex-shrink-0 transition-all duration-300",
											expandedColumn && expandedColumn !== col.id
												? "hidden md:flex"
												: "col-span-2 md:col-span-1",
										)}
									>
										<ColumnHeader
											title={col.title}
											colorClass={col.color}
											count={tasks.filter((t) => t.status === col.id).length}
											onAdd={handleAddTask}
											onClickTitle={() =>
												setExpandedColumn(
													expandedColumn === col.id ? null : col.id,
												)
											}
										/>

										<div className="flex-1 bg-surface/30 rounded-md p-2 min-h-0 overflow-y-auto scrollbar-custom space-y-1 border border-border">
											{expandedColumn === col.id && (
												<div className="md:hidden flex justify-between items-center px-2 py-1 mb-2 bg-primary/10 rounded-md border border-primary/20">
													<span className="text-[10px] font-bold text-primary">
														Focused View
													</span>
													<button
														onClick={() => setExpandedColumn(null)}
														className="text-[10px] font-bold text-text-muted hover:text-text-main"
													>
														Collapse
													</button>
												</div>
											)}
											{tasks.filter((task) => task.status === col.id).length ===
											0 ? (
												<button
													onClick={handleAddTask}
													className="w-full p-4 border border-dashed border-border rounded-lg text-sm text-text-muted hover:border-primary hover:text-primary transition-colors flex flex-col items-center gap-2 h-24 md:h-32 justify-center"
												>
													<Plus size={20} />
													<span className="text-xs">Add task</span>
												</button>
											) : (
												tasks
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
													))
											)}
										</div>
									</div>
								))}
							</motion.div>
						)}

						{activeTab === "Backlog" && (
							<BacklogTab
								tasks={tasks}
								onSelectTask={(task) => setSelectedTask(task)}
							/>
						)}

						{activeTab === "Sprints" && <SprintsTab sprints={sprints} />}

						{activeTab === "Timeline" && (
							<TimelineTab
								tasks={tasks}
								onAddTask={handleAddTask}
								onUpdateTaskDates={() => {
									success(
										"Schedule Updated",
										"Task timeline has been adjusted.",
									);
								}}
							/>
						)}

						{activeTab === "Team" && (
							<TeamTab
								projectTeam={projectTeam}
								hasTeamAssigned={!!currentProject?.teamId}
								onRoleChange={handleRoleChange}
								onGoToSettings={() => setActiveTab("Settings")}
							/>
						)}

						{activeTab === "Repository" && currentProject?.gitHubRepo && (
							<motion.div
								key="repository"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								className="h-full bg-surface/30 border border-border rounded-md p-4 md:p-8 overflow-y-auto"
							>
								<RepositoryTab gitHubRepo={currentProject.gitHubRepo} />
							</motion.div>
						)}

						{activeTab === "Settings" && (
							<SettingsTab project={currentProject} />
						)}
					</AnimatePresence>
				</div>

				<AnimatePresence>
					{showAI && activeTab === "Board" && (
						<motion.div
							initial={{ opacity: 0, x: 300, width: 0 }}
							animate={{ opacity: 1, x: 0, width: 320 }}
							exit={{ opacity: 0, x: 300, width: 0 }}
							className="hidden lg:block shrink-0"
						>
							<AIPredictor
								tasks={tasks}
								sprint={activeSprint}
								className="h-full border-primary/20 shadow-[0_0_40px_rgba(56,189,248,0.1)]"
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default Board;
