import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
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
	ChevronRight,
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
import SprintSelector from "../components/molecules/SprintSelector";
import type { Task, Sprint, Project } from "../types";
import { useProject } from "../hooks/useProject";
import { useToast } from "../hooks/useToast";
import LoadingScreen from "../components/organisms/LoadingScreen";
import { projectService } from "../services/projectService";
import teamService, { type Team } from "../services/teamService";
import { twMerge } from "tailwind-merge";
import EmptyState from "../components/molecules/EmptyState";
import GlassCard from "../components/molecules/GlassCard";

const columns: { id: Task["status"]; title: string; color: string }[] = [
	{ id: "New", title: "New", color: "border-blue-500/50" },
	{ id: "InProgress", title: "In Progress", color: "border-cyan-400/50" },
	{ id: "ReadyForQA", title: "Ready For QA", color: "border-purple-500/50" },
	{ id: "QAFailed", title: "QA Failed", color: "border-red-500/50" },
	{ id: "Developed", title: "Developed", color: "border-emerald-400/50" },
	{ id: "Closed", title: "Closed", color: "border-slate-500/50" },
	{ id: "OnHold", title: "On Hold", color: "border-primary/50" },
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
		createTask,
		createProject,
		moveTask,
		projects: allProjects,
	} = useProject();
	const { success, error: toastError } = useToast();

	const onDragEnd = (result: DropResult) => {
		const { destination, source, draggableId } = result;

		if (!destination) return;

		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		const newStatus = destination.droppableId as Task["status"];
		moveTask(draggableId, newStatus);
		success("Task Moved", `Task status updated to ${newStatus}`);
	};

	const [activeTab, setActiveTab] = useState<ViewTab>("Board");
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
	const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
	const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
	const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);
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

	const handleSelectTask = async (task: Task) => {
		// Optimistically show current data
		setSelectedTask(task);
		try {
			const fullTask = await projectService.getTask(task.id);
			setSelectedTask(fullTask);
		} catch (err) {
			console.error("Failed to fetch task details:", err);
		}
	};

	const handleRoleChange = async (userId: string, newRole: string) => {
		if (!currentProject?.teamId) return;
		try {
			await teamService.updateMemberRole(
				currentProject.teamId,
				userId,
				newRole,
			);
			success("Role Updated", "Member role has been changed for this project.");
			setProjectTeam((prev) => {
				if (!prev) return prev;
				return {
					...prev,
					members: prev.members?.map((m) =>
						m.userId === userId ? { ...m, role: newRole } : m,
					),
				};
			});
		} catch {
			toastError("Update Failed", "Could not change member role.");
		}
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
						toastError("Sync Failed", "Could not connect to the project API.");
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
	}, [fetchTasks, fetchProjects, projectId, navigate]);


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
		success("Project Ready", `Project "${data.name}" has been initialized.`);
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

	if (isInitializing) {
		return (
			<div className="p-4 md:p-8 space-y-8 animate-fade-in">
				<div className="max-w-xl mx-auto space-y-4 text-center">
					<div className="h-10 w-64 bg-surface rounded-lg mx-auto shimmer" />
					<div className="h-4 w-96 bg-surface rounded-lg mx-auto shimmer" />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
					{[1, 2, 3].map((i) => (
						<div key={i} className="h-64 glass-card shimmer rounded-3xl" />
					))}
				</div>
			</div>
		);
	}

	if (projectId && !currentProject) {
		return (
			<div className="h-[80vh] flex flex-col justify-center">
				<EmptyState
					icon={Target}
					title="Project Not Found"
					description="The project you are looking for does not exist or has been archived."
					actionLabel="Select Project"
					onAction={() => navigate("/board")}
					className="max-w-2xl mx-auto"
				/>
			</div>
		);
	}

	if (!projectId) {
		return (
			<div className="h-full flex flex-col space-y-8 p-4 md:p-8 animate-fade-in overflow-y-auto scrollbar-custom">
				<ProjectFormModal
					isOpen={isProjectModalOpen}
					onClose={() => setIsProjectModalOpen(false)}
					onSave={handleCreateProject}
				/>

				<div className="max-w-6xl mx-auto w-full space-y-10">
					<div className="text-center space-y-4">
						<h1 className="text-5xl font-black tracking-tight text-text-main animate-slide-up">
							Project <span className="text-primary">Hub</span>
						</h1>
						<p className="text-text-muted max-w-xl mx-auto text-base animate-slide-up" style={{ animationDelay: '0.1s' }}>
							Select an active repository below to access live boards, sprints,
							and automated deployment pipelines.
						</p>
					</div>

					{allProjects.length === 0 ? (
						<EmptyState
							icon={Target}
							title="No Active Projects"
							description="You haven't initialized any projects yet. Create a project to start tracking tasks and automated pipelines."
							actionLabel="Initialize Project"
							onAction={() => setIsProjectModalOpen(true)}
							className="max-w-2xl mx-auto animate-slide-up"
						/>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{allProjects.map((project, idx) => (
								<GlassCard
									key={project.id}
									isInteractive
									onClick={() => navigate(`/project/${project.id}`)}
									className="group animate-slide-up"
									style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
								>
									<div className="absolute -top-4 -right-4 p-8 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-500">
										<Target size={120} />
									</div>

									<div className="space-y-6">
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-300">
												<Layout size={24} />
											</div>
											<div>
												<h3 className="text-lg font-black text-text-main group-hover:text-primary transition-colors">
													{project.name}
												</h3>
												<div className="flex items-center gap-2">
													<span className="px-2 py-0.5 rounded bg-surface border border-primary/30 text-[10px] font-mono text-text-muted uppercase">
														{project.key}
													</span>
													<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
												</div>
											</div>
										</div>

										<p className="text-sm text-text-muted line-clamp-2 leading-relaxed">
											{project.description ||
												"Enterprise-grade project tracking and automated workflow management."}
										</p>

										<div className="pt-6 flex items-center justify-between border-t border-[#334155]/50">
											<div className="flex items-center gap-3">
												<div className="flex items-center gap-2 px-3 py-1.5 bg-[#0f172a] border border-[#334155] rounded-md shadow-inner group-hover:border-[#38bdf8]/30 transition-colors">
													<div className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
													<span className="text-[11px] font-black text-[#f8fafc] uppercase tracking-wider">
														{project.newTasksCount || 0} New Tasks
													</span>
												</div>
											</div>
											<Button variant="ghost" size="sm" className="font-bold text-[10px] uppercase tracking-widest text-[#94a3b8] hover:text-[#38bdf8] hover:bg-transparent p-0 flex items-center gap-2 group-hover:translate-x-1 transition-all">
												Access Board <ChevronRight size={14} />
											</Button>
										</div>
									</div>
								</GlassCard>
							))}

							{/* Create New Project Card */}
							<GlassCard
								onClick={() => setIsProjectModalOpen(true)}
								isInteractive
								className="group border-dashed border-2 border-primary/30/50 bg-transparent hover:bg-primary/5 hover:border-primary/50 animate-slide-up flex flex-col items-center justify-center min-h-[260px]"
								style={{ animationDelay: `${0.1 + allProjects.length * 0.05}s` }}
							>
								<div className="w-16 h-16 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center text-text-muted mb-4 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
									<Plus size={32} />
								</div>
								<h3 className="font-black text-text-main group-hover:text-primary transition-colors">
									Initialize Project
								</h3>
								<p className="text-xs text-text-muted mt-2">New workflow environment</p>
							</GlassCard>
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
				key={selectedTask?.id || "no-task"}
				isOpen={!!selectedTask}
				onClose={() => setSelectedTask(null)}
				task={selectedTask || ({} as Task)}
				onRefresh={() => projectId && fetchTasks(projectId)}
				onSelectTask={handleSelectTask}
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
							className="flex items-center gap-2 hover:bg-[var(--accent-primary)]/10 px-2 py-1 -ml-2 rounded-md transition-all group"
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
										className="absolute top-full left-0 mt-2 w-72 bg-surface border border-primary/30 rounded-md shadow-2xl z-50 overflow-hidden"
									>
										<div className="p-2 border-b border-primary/30 bg-[var(--accent-primary)]/10">
											<span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
												Switch Project
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
														className={`w-8 h-8 rounded flex items-center justify-center ${p.id === projectId ? "bg-primary text-[var(--text-primary)]" : "bg-surface border border-primary/30 text-text-muted"}`}
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
						<span className="font-black text-[10px] text-text-muted bg-surface px-1.5 py-0.5 rounded border border-primary/30 uppercase tracking-widest">
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
									key={member.userId}
									name={member.name}
									size="sm"
									className="border-2 border-background hover:z-10 transition-all shadow-sm"
								/>
							))}
							{projectTeam?.members && projectTeam.members.length > 5 && (
								<div className="w-8 h-8 rounded-full bg-surface border-2 border-background flex items-center justify-center text-[10px] font-black text-text-muted hover:z-10 transition-all shadow-sm">
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
			<div className="sticky top-0 z-30 flex items-center justify-between border-b border-primary/30 bg-[var(--card-bg)] dark:bg-gray-950/80 backdrop-blur-md px-4 shrink-0 overflow-x-auto scrollbar-hide">
				<div className="flex items-center gap-1">
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
								className={`flex items-center gap-2 px-4 py-3 text-[13px] font-medium transition-all relative border-b-2 whitespace-nowrap ${
									activeTab === tab
										? "border-primary text-primary"
										: "border-transparent text-text-muted hover:text-primary"
								}`}
							>
								<Icon size={14} />
								<span className="hidden md:inline">
									{tab === "Timeline"
										? "Schedule"
										: tab === "Repository"
											? "Git"
											: tab}
								</span>
								{tab === "Backlog" && (
									<span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-surface text-[10px] font-semibold">
										{tasks.length}
									</span>
								)}
							</button>
						);
					})}
				</div>

				{activeTab === "Board" && (
					<div className="flex items-center gap-2 py-2">
						<button
							onClick={() => setShowAI(!showAI)}
							className={twMerge(
								"flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
								showAI
									? "bg-surface text-[var(--text-primary)] border-primary/30 shadow-sm"
									: "bg-white dark:bg-gray-950 border-primary/30 text-text-muted hover:text-text-main dark:hover:text-[var(--text-primary)]",
							)}
						>
							<Sparkles size={14} className={showAI ? "animate-pulse" : ""} />
							<span className="hidden md:inline">AI Insights</span>
						</button>
					</div>
				)}
			</div>

			<div className="flex-1 overflow-hidden flex gap-6 p-4 md:p-6 bg-gray-50/50 dark:bg-transparent">
				<div className="flex-1 overflow-hidden">
					<AnimatePresence mode="wait">
						{activeTab === "Board" && (
							<DragDropContext onDragEnd={onDragEnd}>
								<motion.div
									key="board"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="h-full flex overflow-x-auto snap-x snap-mandatory md:snap-none gap-6 pb-6 scrollbar-custom min-h-0"
								>
									{columns.map((col, idx) => (
										<div
											key={col.id}
											className="flex flex-col w-[85vw] md:w-80 flex-shrink-0 snap-center animate-slide-up"
											style={{ animationDelay: `${idx * 0.05}s` }}
										>
											<div className="flex items-center justify-between mb-4 px-1">
												<div className="flex items-center gap-3">
													<h3 className="text-xs font-black text-text-main uppercase tracking-widest">
														{col.title}
													</h3>
													<span className="text-[10px] font-black text-text-muted bg-surface border border-primary/30 px-2 py-0.5 rounded-full">
														{tasks.filter((t) => t.status === col.id).length}
													</span>
												</div>
												<button
													onClick={handleAddTask}
													className="p-1 hover:bg-surface rounded-md transition-colors text-text-muted hover:text-primary"
												>
													<Plus size={16} />
												</button>
											</div>

											<Droppable droppableId={col.id}>
												{(provided, snapshot) => (
													<div
														{...provided.droppableProps}
														ref={provided.innerRef}
														className={`flex-1 min-h-[150px] overflow-y-auto scrollbar-hide space-y-3 pb-4 transition-colors rounded-xl p-2 ${
															snapshot.isDraggingOver
																? "bg-primary/5 border-2 border-dashed border-primary/20"
																: ""
														}`}
													>
														{tasks.filter((task) => task.status === col.id).length ===
														0 ? (
															<div className="h-32 border-2 border-dashed border-primary/30 rounded-xl flex items-center justify-center bg-surface/50">
																<span className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50">
																	No Tasks
																</span>
															</div>
														) : (
															tasks
																.filter((task) => task.status === col.id)
																.map((task, index) => (
																	<Draggable
																		key={task.id}
																		draggableId={task.id}
																		index={index}
																	>
																		{(provided, snapshot) => (
																			<div
																				ref={provided.innerRef}
																				{...provided.draggableProps}
																				{...provided.dragHandleProps}
																				className={snapshot.isDragging ? "z-50" : ""}
																			>
																				<TaskCard
																					task={task}
																					onClick={() => handleSelectTask(task)}
																				/>
																			</div>
																		)}
																	</Draggable>
																))
														)}
														{provided.placeholder}
													</div>
												)}
											</Droppable>
										</div>
									))}
								</motion.div>
							</DragDropContext>
						)}

						{activeTab === "Backlog" && (
							<BacklogTab
								tasks={tasks}
								onSelectTask={handleSelectTask}
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
									className="h-full bg-surface/30 border border-primary/30 rounded-md p-4 md:p-8 overflow-y-auto"
								>
									<RepositoryTab
										gitHubRepo={currentProject.repositories[0].repoName}
									/>
								</motion.div>
							)}

						{activeTab === "Settings" && currentProject && (
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
