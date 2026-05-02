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
import EmptyState from "../components/molecules/EmptyState";

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
	const {
		tasks,
		fetchTasks,
		fetchProjects,
		moveTask,
		assignTask,
		createTask,
		createProject,
		projects: allProjects,
	} = useProject();
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
	const [projectTeam, setProjectTeam] = useState<Team | null>(null);
	const [sprints, setSprints] = useState<Sprint[]>([]);
	const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
	const [isInitializing, setIsInitializing] = useState(true);

	useEffect(() => {
		if (currentProject?.teamId) {
			teamService
				.getTeam(currentProject.teamId)
				.then(setProjectTeam)
				.catch(console.error);
		}
	}, [currentProject?.teamId]);

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
				fetchProjects(),
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
						// If we can't load the project, we should probably let the user go back to the workspace list
						setIsInitializing(false);
						setCurrentProject(null);
					}
				})
				.finally(() => {
					if (isMounted) setIsInitializing(false);
				});
			fetchTasks(projectId);
		} else {
			fetchProjects().finally(() => {
				if (isMounted) setIsInitializing(false);
			});
		}

		return () => {
			isMounted = false;
			setCurrentProject(null);
			setIsInitializing(true);
		};
	}, [fetchTasks, fetchProjects, projectId, navigate, error]);

	const handleMoveTask = async (taskId: string, newStatus: Task["status"]) => {
		await moveTask(taskId, newStatus);
		success("Task Moved", `Task status updated to ${newStatus}.`);
	};

	const handleAddTask = useCallback(() => {
		setEditingTask(null);
		setIsTaskModalOpen(true);
	}, []);

	const handleSaveTask = async (data: Partial<Task>) => {
		const taskData = { ...data, projectId: data.projectId || projectId };
		await createTask(taskData);
		success(
			"Action Successful",
			editingTask ? "Task updated." : "New task created.",
		);
		setIsTaskModalOpen(false);
		if (
			!editingTask &&
			taskData.projectId &&
			taskData.projectId !== projectId
		) {
			navigate(`/project/${taskData.projectId}`);
		}
	};

	const handleCreateProject = async (data: Partial<Project>) => {
		await createProject(data);
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

	if (projectId && !currentProject && !isInitializing) {
		return (
			<div className="h-[80vh] flex flex-col justify-center">
				<EmptyState
					icon={Target}
					title="Project Not Found"
					description="The workspace you are looking for does not exist or has been archived."
					actionLabel="Select Workspace"
					onAction={() => navigate("/board")}
					className="max-w-2xl mx-auto"
				/>
			</div>
		);
	}

	if (!projectId && !isInitializing) {
		return (
			<div className="h-full flex flex-col space-y-8 p-4 md:p-8 animate-fade-in overflow-y-auto scrollbar-custom">
				<ProjectFormModal
					isOpen={isProjectModalOpen}
					onClose={() => setIsProjectModalOpen(false)}
					onSave={handleCreateProject}
				/>

				<div className="max-w-6xl mx-auto w-full space-y-10">
					<div className="text-center space-y-4">
						<h1 className="text-4xl font-black tracking-tight text-white">
							Choose your <span className="text-primary">Workspace</span>
						</h1>
						<p className="text-text-muted max-w-xl mx-auto text-sm">
							Select an active project below to open its task board, sprints,
							and automated repository metrics.
						</p>
					</div>

					{allProjects.length === 0 ? (
						<EmptyState
							icon={Target}
							title="No Active Workspaces"
							description="You haven't initialized any projects yet. Create a workspace to start tracking tasks and automated pipelines."
							actionLabel="Initialize Project"
							onAction={() => setIsProjectModalOpen(true)}
							className="max-w-2xl mx-auto"
						/>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{allProjects.map((project) => (
								<motion.div
									key={project.id}
									whileHover={{ y: -5, scale: 1.02 }}
									onClick={() => navigate(`/project/${project.id}`)}
									className="group relative bg-surface border border-border rounded-3xl p-6 cursor-pointer hover:border-primary/50 transition-all overflow-hidden"
								>
									<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
										<Target size={80} />
									</div>

									<div className="relative z-10 space-y-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
												<Layout size={20} />
											</div>
											<div>
												<h3 className="font-black text-white group-hover:text-primary transition-colors">
													{project.name}
												</h3>
												<span className="text-[10px] font-mono text-text-muted uppercase">
													{project.key}
												</span>
											</div>
										</div>

										<p className="text-xs text-text-muted line-clamp-2 min-h-[32px]">
											{project.description ||
												"No description provided for this workspace."}
										</p>

										<div className="pt-4 flex items-center justify-between border-t border-border/50">
											<div className="flex -space-x-2">
												{[1, 2, 3].map((i) => (
													<div
														key={i}
														className="w-6 h-6 rounded-full border-2 border-surface bg-surface-hover flex items-center justify-center"
													>
														<div className="w-full h-full rounded-full bg-primary/20 scale-75" />
													</div>
												))}
											</div>
											<span className="text-[10px] font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
												Open Board{" "}
												<ChevronDown size={14} className="-rotate-90" />
											</span>
										</div>
									</div>
								</motion.div>
							))}

							{/* Create New Project Card */}
							<motion.button
								whileHover={{ scale: 1.02 }}
								onClick={() => setIsProjectModalOpen(true)}
								className="group border-2 border-dashed border-border hover:border-primary/50 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 transition-all bg-surface/10"
							>
								<div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-text-muted group-hover:text-primary group-hover:bg-primary/10 transition-all">
									<Plus size={24} />
								</div>
								<div className="text-center">
									<span className="block font-bold text-white text-sm">
										New Workspace
									</span>
									<span className="text-[10px] text-text-muted">
										Expand your registry
									</span>
								</div>
							</motion.button>
						</div>
					)}
				</div>
			</div>
		);
	}

	if (isInitializing) {
		return <LoadingScreen />;
	}

	return (
		<div className="h-full flex flex-col space-y-4 md:space-y-6 pb-10 overflow-hidden relative">
			<TaskDetailModal
				isOpen={!!selectedTask}
				onClose={() => setSelectedTask(null)}
				task={selectedTask || ({} as Task)}
				onAssign={handleAssignTask}
				onRefresh={() => projectId && fetchTasks(projectId)}
			/>

			<TaskFormModal
				key={editingTask?.id || "new-task"}
				isOpen={isTaskModalOpen}
				onClose={() => setIsTaskModalOpen(false)}
				task={editingTask}
				onSave={handleSaveTask}
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
								{currentProject?.name || "Select Project"}
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
							{currentProject?.description}
						</span>
						<span className="hidden md:inline w-1 h-1 rounded-full bg-border"></span>
						<span className="font-black text-[10px] text-text-muted bg-surface px-1.5 py-0.5 rounded border border-border uppercase tracking-widest">
							{currentProject?.key}
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
								onAddTask={handleAddTask}
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

						{activeTab === "Repository" &&
							currentProject?.repositories &&
							currentProject.repositories.length > 0 && (
								<motion.div
									key="repository"
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -20 }}
									className="h-full bg-surface/30 border border-border rounded-md p-4 md:p-8 overflow-y-auto"
								>
									<RepositoryTab
										gitHubRepo={currentProject.repositories[0].name}
									/>
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
