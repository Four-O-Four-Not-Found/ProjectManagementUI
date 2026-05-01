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
	Save,
	GitBranch,
	Clock,
} from "lucide-react";
import TaskCard from "../components/molecules/TaskCard";
import TaskDetailModal from "../components/organisms/TaskDetailModal";
import TaskFormModal from "../components/organisms/TaskFormModal";
import ProjectFormModal from "../components/organisms/ProjectFormModal";
import SprintFormModal from "../components/organisms/SprintFormModal";
import RepositoryTab from "../components/organisms/RepositoryTab";
import Button from "../components/atoms/Button";
import Avatar from "../components/atoms/Avatar";
import PageHeader from "../components/molecules/PageHeader";
import ColumnHeader from "../components/molecules/ColumnHeader";
import SprintSelector from "../components/molecules/SprintSelector";
import type { Task, Sprint, Project } from "../types";
import { useProject } from "../hooks/useProject";
import { useToast } from "../hooks/useToast";
import LoadingScreen from "../components/organisms/LoadingScreen";
import { MOCK_SPRINTS } from "../mocks/data";
import { projectService } from "../services/projectService";
import teamService, { type Team } from "../services/teamService";
import { githubService, type GitHubRepo } from "../services/githubService";

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

	const [currentProject, setCurrentProject] = useState<Project | null>(null);
	const [allProjects, setAllProjects] = useState<Project[]>([]);
	const [workspaceTeams, setWorkspaceTeams] = useState<Team[]>([]);
	const [projectTeam, setProjectTeam] = useState<Team | null>(null);
	const [repos, setRepos] = useState<GitHubRepo[]>([]);
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
		if (activeTab === "Settings" && currentProject?.workspaceId) {
			Promise.all([
				teamService
					.getWorkspaceTeams(currentProject.workspaceId)
					.catch(() => []),
				githubService.getRepositories().catch(() => []),
			]).then(([teamsData, reposData]) => {
				setWorkspaceTeams(teamsData);
				setRepos(reposData);
			});
		}
	}, [activeTab, currentProject?.workspaceId]);

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
			])
				.catch(console.error)
				.finally(() => {
					if (isMounted) setIsInitializing(false);
				});
			fetchTasks(projectId);
		} else {
			// If no project ID is provided, try to load the first available project
			projectService.getProjects().then((projects) => {
				if (!isMounted) return;
				if (projects.length > 0) {
					navigate(`/project/${projects[0].id}`, { replace: true });
				} else {
					// No projects exist, bounce back to dashboard
					navigate(`/`, { replace: true });
				}
			});
		}

		return () => {
			isMounted = false;
			setCurrentProject(null);
			setIsInitializing(true);
		};
	}, [fetchTasks, projectId, navigate]);

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

	if ((loading && tasks.length === 0) || isInitializing || !currentProject) {
		return <LoadingScreen />;
	}

	return (
		<div className="h-full flex flex-col space-y-6 pb-10 overflow-hidden">
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
				gitHubRepo={currentProject.gitHubRepo}
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
			<div className="flex items-center gap-1 border-b border-border bg-surface-hover/30 px-2 rounded-t-md overflow-x-auto scrollbar-hide shrink-0">
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
						Settings: Settings,
					}[tab];

					return (
						<button
							key={tab}
							onClick={() => {
								if (tab === "Sprints") {
									navigate(`/project/${projectId}/sprints`);
								} else {
									setActiveTab(tab);
								}
							}}
							className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-all relative border-b-2 whitespace-nowrap ${
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
							className="h-full grid grid-cols-2 md:flex gap-3 md:gap-6 overflow-y-auto md:overflow-x-auto pb-4 scrollbar-custom min-h-0 px-2 md:px-0"
						>
							{columns.map((col) => (
								<div
									key={col.id}
									className="flex flex-col min-w-0 md:w-80 md:flex-shrink-0"
								>
									<ColumnHeader
										title={col.title}
										colorClass={col.color}
										count={tasks.filter((t) => t.status === col.id).length}
										onAdd={handleAddTask}
									/>

									<div className="flex-1 bg-surface/30 rounded-md p-2 min-h-0 overflow-y-auto scrollbar-custom space-y-1 border border-border">
										{tasks.filter((task) => task.status === col.id).length ===
										0 ? (
											<button
												onClick={handleAddTask}
												className="w-full p-4 border border-dashed border-border rounded-lg text-sm text-text-muted hover:border-primary hover:text-primary transition-colors flex flex-col items-center gap-2"
											>
												<Plus size={20} />
												<span>Add task to start</span>
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
							className="h-full bg-surface/30 border border-border rounded-md overflow-hidden flex flex-col"
						>
							<div className="p-4 border-b border-border bg-surface-hover flex justify-between items-center">
								<h3 className="font-bold text-text-main flex items-center gap-2">
									<CalendarIcon size={16} className="text-primary" />
									Gantt Chart
								</h3>
								<div className="flex gap-2">
									<Button variant="secondary" size="sm">
										Today
									</Button>
									<Button variant="secondary" size="sm">
										Months
									</Button>
								</div>
							</div>
							<div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
								<div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted">
									<CalendarIcon size={32} />
								</div>
								<div>
									<h3 className="font-bold text-text-main">
										No tasks scheduled
									</h3>
									<p className="text-sm text-text-muted mt-2 max-w-sm">
										Add tasks with start and end dates to visualize them on the
										Gantt chart timeline.
									</p>
								</div>
								<Button
									variant="primary"
									onClick={handleAddTask}
									leftIcon={<Plus size={16} />}
								>
									Add task to start
								</Button>
							</div>
						</motion.div>
					)}

					{activeTab === "Team" && (
						<motion.div
							key="team"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							className="h-full bg-surface/30 border border-border rounded-md p-8 overflow-y-auto"
						>
							<div className="max-w-4xl mx-auto space-y-6">
								<div>
									<h2 className="text-xl font-bold text-text-main flex items-center gap-2">
										<UsersIcon className="text-primary" size={24} />
										Project Team
									</h2>
									<p className="text-sm text-text-muted mt-1">
										Members of the team assigned to this project.
									</p>
								</div>

								{!currentProject?.teamId ? (
									<div className="p-8 border border-dashed border-border rounded-lg flex flex-col items-center justify-center text-center bg-surface/10">
										<div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted mb-4">
											<UsersIcon size={24} />
										</div>
										<h3 className="text-text-main font-bold">
											No Team Assigned
										</h3>
										<p className="text-sm text-text-muted max-w-sm mt-2">
											There is no team assigned to this project yet. Go to
											Settings to assign a workspace team.
										</p>
										<Button
											variant="primary"
											className="mt-4"
											onClick={() => setActiveTab("Settings")}
										>
											Go to Settings
										</Button>
									</div>
								) : projectTeam ? (
									<div className="space-y-4">
										<div className="p-4 border border-border rounded-lg bg-surface/50 flex justify-between items-center">
											<div>
												<h3 className="font-bold text-text-main">
													{projectTeam.name}
												</h3>
												<p className="text-xs text-text-muted mt-1">
													{projectTeam.description ||
														"No description provided."}
												</p>
											</div>
											<Button
												variant="secondary"
												onClick={() => (window.location.href = "/team")}
											>
												Manage Team
											</Button>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
											{projectTeam.members?.map((member) => (
												<div
													key={member.profileId}
													className="p-4 border border-border rounded-lg bg-surface flex items-center gap-4 hover:border-text-muted transition-colors"
												>
													<Avatar name={member.name} size="md" />
													<div>
														<p className="text-sm font-bold text-text-main">
															{member.name}
														</p>
														<select
															value={member.role}
															onChange={(e) =>
																handleRoleChange(
																	member.profileId,
																	e.target.value,
																)
															}
															className={`bg-surface-hover border border-border rounded px-2 py-1 text-xs font-medium focus:outline-none focus:border-primary transition-colors cursor-pointer mt-1 ${
																["Project Manager", "Product Owner"].includes(
																	member.role,
																)
																	? "text-purple-400"
																	: [
																				"Tech Lead",
																				"Senior Developer",
																				"DevOps Engineer",
																		  ].includes(member.role)
																		? "text-emerald-400"
																		: [
																					"UI/UX Designer",
																					"QA Engineer",
																			  ].includes(member.role)
																			? "text-amber-400"
																			: member.role === "Stakeholder"
																				? "text-slate-400"
																				: "text-primary"
															}`}
														>
															<optgroup
																label="Management"
																className="bg-slate-900 text-slate-500"
															>
																<option
																	value="Project Manager"
																	className="text-purple-400"
																>
																	Project Manager
																</option>
																<option
																	value="Product Owner"
																	className="text-purple-400"
																>
																	Product Owner
																</option>
															</optgroup>
															<optgroup
																label="Engineering"
																className="bg-slate-900 text-slate-500"
															>
																<option
																	value="Tech Lead"
																	className="text-emerald-400"
																>
																	Tech Lead
																</option>
																<option
																	value="Senior Developer"
																	className="text-emerald-400"
																>
																	Senior Developer
																</option>
																<option
																	value="Developer"
																	className="text-primary"
																>
																	Developer
																</option>
																<option
																	value="Junior Developer"
																	className="text-primary"
																>
																	Junior Developer
																</option>
																<option
																	value="DevOps Engineer"
																	className="text-emerald-400"
																>
																	DevOps Engineer
																</option>
															</optgroup>
															<optgroup
																label="Design & Quality"
																className="bg-slate-900 text-slate-500"
															>
																<option
																	value="UI/UX Designer"
																	className="text-amber-400"
																>
																	UI/UX Designer
																</option>
																<option
																	value="QA Engineer"
																	className="text-amber-400"
																>
																	QA Engineer
																</option>
															</optgroup>
															<optgroup
																label="Other"
																className="bg-slate-900 text-slate-500"
															>
																<option
																	value="Stakeholder"
																	className="text-slate-400"
																>
																	Stakeholder
																</option>
																<option value="Member" className="text-primary">
																	Member
																</option>
															</optgroup>
														</select>
													</div>
												</div>
											))}
											{(!projectTeam.members ||
												projectTeam.members.length === 0) && (
												<div className="col-span-full p-8 border border-dashed border-border rounded-lg text-center text-text-muted">
													No members found in this team.
												</div>
											)}
										</div>
									</div>
								) : (
									<div className="flex items-center justify-center p-12">
										<div className="animate-spin text-primary">
											<Target size={24} />
										</div>
									</div>
								)}
							</div>
						</motion.div>
					)}

					{activeTab === "Repository" && (
						<motion.div
							key="repository"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							className="h-full bg-surface/30 border border-border rounded-md p-8 overflow-y-auto"
						>
							<div className="max-w-6xl mx-auto space-y-6">
								<div>
									<h2 className="text-xl font-bold text-text-main flex items-center gap-2">
										<GitBranch className="text-primary" size={24} />
										Repository Integration
									</h2>
									<p className="text-sm text-text-muted mt-1">
										View branches, commits, and pull requests for the attached
										GitHub repository.
									</p>
								</div>

								{!currentProject?.gitHubRepo ? (
									<div className="p-8 border border-dashed border-border rounded-lg flex flex-col items-center justify-center text-center bg-surface/10">
										<div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted mb-4">
											<GitBranch size={24} />
										</div>
										<h3 className="text-text-main font-bold">
											No Repository Attached
										</h3>
										<p className="text-sm text-text-muted max-w-sm mt-2">
											There is no GitHub repository attached to this workspace.
											Go to Settings to link one.
										</p>
										<Button
											variant="primary"
											className="mt-4"
											onClick={() => setActiveTab("Settings")}
										>
											Go to Settings
										</Button>
									</div>
								) : (
									<RepositoryTab gitHubRepo={currentProject.gitHubRepo} />
								)}
							</div>
						</motion.div>
					)}

					{activeTab === "Settings" && (
						<motion.div
							key="settings"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							className="h-full bg-surface/30 border border-border rounded-md p-8 overflow-y-auto"
						>
							<div className="max-w-2xl mx-auto space-y-8">
								<div>
									<h2 className="text-xl font-bold text-text-main">
										Project Settings
									</h2>
									<p className="text-sm text-text-muted mt-1">
										Manage your workspace details and integrations.
									</p>
								</div>

								<form
									onSubmit={async (e) => {
										e.preventDefault();
										const form = e.target as HTMLFormElement;
										const data = {
											name: (
												form.elements.namedItem("name") as HTMLInputElement
											).value,
											key: (form.elements.namedItem("key") as HTMLInputElement)
												.value,
											description: (
												form.elements.namedItem(
													"description",
												) as HTMLTextAreaElement
											).value,
											gitHubRepo:
												(
													form.elements.namedItem(
														"gitHubRepo",
													) as HTMLSelectElement
												).value || undefined,
											teamId:
												(form.elements.namedItem("teamId") as HTMLSelectElement)
													.value || undefined,
										};
										try {
											const updatedProject = await projectService.updateProject(
												currentProject.id,
												data,
											);
											setCurrentProject(updatedProject);
											success(
												"Settings Saved",
												"Project details have been updated successfully.",
											);
										} catch (err) {
											console.error("Update failed", err);
										}
									}}
									className="space-y-6 bg-surface border border-border rounded-lg p-6"
								>
									<div className="space-y-4">
										<div>
											<label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">
												Project Name
											</label>
											<input
												name="name"
												defaultValue={currentProject.name}
												className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary transition-colors"
												required
											/>
										</div>
										<div>
											<label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">
												Project Key
											</label>
											<input
												name="key"
												defaultValue={currentProject.key}
												className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary transition-colors uppercase"
												required
												maxLength={5}
											/>
										</div>
										<div>
											<label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">
												Description
											</label>
											<textarea
												name="description"
												defaultValue={currentProject.description}
												className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary transition-colors min-h-[100px]"
											/>
										</div>
										<div>
											<label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">
												GitHub Repository
											</label>
											<select
												key={`repo-${repos.length}`}
												name="gitHubRepo"
												defaultValue={currentProject.gitHubRepo || ""}
												className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary transition-colors appearance-none"
											>
												<option value="">No Repository Attached</option>
												{repos.map((repo) => (
													<option key={repo.fullName} value={repo.fullName}>
														{repo.name} ({repo.fullName})
													</option>
												))}
											</select>
										</div>
										<div>
											<label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">
												Assigned Team
											</label>
											<select
												key={`team-${workspaceTeams.length}`}
												name="teamId"
												defaultValue={currentProject.teamId || ""}
												className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary transition-colors appearance-none"
											>
												<option value="">No Team Assigned</option>
												{workspaceTeams.map((team) => (
													<option key={team.id} value={team.id}>
														{team.name}
													</option>
												))}
											</select>
										</div>
									</div>
									<div className="pt-4 border-t border-border flex justify-end">
										<Button
											type="submit"
											variant="primary"
											leftIcon={<Save size={16} />}
										>
											Save Settings
										</Button>
									</div>
								</form>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default Board;
