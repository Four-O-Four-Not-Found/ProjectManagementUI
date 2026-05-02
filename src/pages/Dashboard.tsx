import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Users,
	CheckCircle2,
	Clock,
	FileText,
	Plus,
	GitBranch,
	ChevronRight,
	Target,
	AlertTriangle,
	Bookmark,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../components/molecules/PageHeader";
import Button from "../components/atoms/Button";
import StatCard from "../components/molecules/StatCard";
import GlassCard from "../components/molecules/GlassCard";
import TaskFormModal from "../components/organisms/TaskFormModal";
import ProjectFormModal from "../components/organisms/ProjectFormModal";
import ActivityDetailModal from "../components/organisms/ActivityDetailModal";
import { useToast } from "../hooks/useToast";
import type { Task, Project, Activity } from "../types";
import { projectService } from "../services/projectService";
import apiClient from "../services/apiClient";
import BurndownChart from "../components/molecules/BurndownChart";
import WorkloadChart from "../components/molecules/WorkloadChart";
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "../store/useAuthStore";

interface DashboardStats {
	totalTasks: number;
	activeSprints: number;
	teamMembers: number;
	openPullRequests: number;
	burndownData: { day: string; ideal: number; actual: number }[];
	workloadData: { name: string; tasks: number; color: string }[];
	assignedTasks: Task[];
	recentActivities: Activity[];
}

import EmptyState from "../components/molecules/EmptyState";

const Dashboard: React.FC = () => {
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const { success, info } = useToast();
	const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
	const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
	const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
		null,
	);
	const [projects, setProjects] = useState<Project[]>([]);
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadDashboardData = async () => {
			setLoading(true);
			try {
				const [projectsData, statsData] = await Promise.all([
					projectService.getProjects(),
					apiClient
						.get<DashboardStats>("/dashboard/stats")
						.then((res) => res.data),
				]);
				setProjects(projectsData);
				setStats(statsData);
			} catch (error) {
				console.error("Dashboard load failed", error);
				// Provide empty stats so the UI can still render
				setStats({
					totalTasks: 0,
					activeSprints: 0,
					teamMembers: 0,
					openPullRequests: 0,
					burndownData: [],
					workloadData: [],
					assignedTasks: [],
					recentActivities: [],
				});
			} finally {
				setLoading(false);
			}
		};
		loadDashboardData();
	}, []);

	const handleCreateTask = async (data: Partial<Task>) => {
		try {
			await projectService.createTask(data);
			success(
				"Task Dispatched",
				`Entry "${data.title}" has been added to the backlog.`,
			);
			setIsTaskModalOpen(false);
			// Refresh stats to show the new task in the count
			const statsData = await apiClient
				.get<DashboardStats>("/dashboard/stats")
				.then((res) => res.data);
			setStats(statsData);
		} catch (error) {
			console.error("Failed to create task", error);
		}
	};

	const handleCreateProject = async (data: Partial<Project>) => {
		try {
			const newProject = await projectService.createProject(data);
			success("Workspace Initialized", `Project "${data.name}" is now live.`);
			setProjects([...projects, newProject]);
			setIsProjectModalOpen(false);
		} catch (error) {
			console.error("Failed to create project", error);
		}
	};

	if (loading || !stats) {
		return (
			<div className="flex items-center justify-center h-[60vh]">
				<div className="flex flex-col items-center gap-4 text-text-muted">
					<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
					<span className="text-sm font-bold uppercase tracking-widest">
						Syncing Workspace...
					</span>
				</div>
			</div>
		);
	}

	if (projects.length === 0) {
		return (
			<div className="space-y-8 animate-fade-in pb-10 h-[80vh] flex flex-col justify-center">
				<ProjectFormModal
					isOpen={isProjectModalOpen}
					onClose={() => setIsProjectModalOpen(false)}
					onSave={handleCreateProject}
				/>
				<EmptyState
					icon={Target}
					title="No Workspaces Found"
					description="Your project board is currently empty. Initialize your first project to start tracking tasks and sprints."
					actionLabel="Create First Project"
					onAction={() => setIsProjectModalOpen(true)}
					className="max-w-2xl mx-auto"
				/>
			</div>
		);
	}

	const urgentTasks = (stats?.assignedTasks || []).filter(
		(t) => t.priority === "Urgent" || t.priority === "High",
	);

	return (
		<div className="space-y-8 animate-fade-in pb-10">
			<TaskFormModal
				key="dashboard-new-task"
				isOpen={isTaskModalOpen}
				onClose={() => setIsTaskModalOpen(false)}
				onSave={handleCreateTask}
				projects={projects}
			/>

			<ProjectFormModal
				isOpen={isProjectModalOpen}
				onClose={() => setIsProjectModalOpen(false)}
				onSave={handleCreateProject}
			/>

			<ActivityDetailModal
				isOpen={!!selectedActivity}
				onClose={() => setSelectedActivity(null)}
				activity={selectedActivity}
			/>

			<PageHeader
				title="Project Overview"
				description={
					<>
						Welcome back,{" "}
						<span className="text-white font-bold">
							{user?.displayName || "Agent"}
						</span>
						! Here's what's happening with{" "}
						<span className="text-primary font-medium">FlowState</span> today.
					</>
				}
				actions={
					<>
						<Button
							variant="secondary"
							className="flex-1 md:flex-none"
							leftIcon={<FileText size={16} />}
							onClick={() =>
								info("Report Generating", "Compiling workspace metrics...")
							}
						>
							Report
						</Button>
						<Button
							variant="secondary"
							className="flex-1 md:flex-none"
							leftIcon={<Target size={16} />}
							onClick={() => setIsProjectModalOpen(true)}
						>
							Create Project
						</Button>
						<Button
							className="flex-1 md:flex-none"
							leftIcon={<Plus size={16} />}
							onClick={() => setIsTaskModalOpen(true)}
						>
							New Task
						</Button>
					</>
				}
			/>

			<div className="grid grid-cols-2 gap-3 md:gap-6">
				<StatCard
					label="Total Tasks"
					value={stats.totalTasks.toString()}
					icon={CheckCircle2}
					colorClass="bg-primary"
					trend="+12%"
				/>
				<StatCard
					label="Active Sprints"
					value={stats.activeSprints.toString()}
					icon={Clock}
					colorClass="bg-merged"
				/>
				<StatCard
					label="Team Members"
					value={stats.teamMembers.toString()}
					icon={Users}
					colorClass="bg-primary"
				/>
				<StatCard
					label="PRs Open"
					value={stats.openPullRequests.toString()}
					icon={GitBranch}
					colorClass="bg-danger"
					trend="+4"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left Column: Assigned Tasks & Stats */}
				<div className="lg:col-span-2 space-y-8">
					{/* Callouts Section */}
					<AnimatePresence>
						{urgentTasks.length > 0 && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								className="bg-danger/10 border border-danger/20 rounded-2xl p-4 flex items-center gap-4 overflow-hidden"
							>
								<div className="w-10 h-10 rounded-full bg-danger/20 flex items-center justify-center text-danger shrink-0">
									<AlertTriangle size={20} />
								</div>
								<div className="flex-1 min-w-0">
									<h4 className="text-sm font-bold text-danger">
										Priority Alerts
									</h4>
									<p className="text-xs text-danger/70 truncate">
										You have {urgentTasks.length} urgent tasks requiring
										immediate attention.
									</p>
								</div>
								<Button
									size="xs"
									variant="primary"
									className="bg-danger hover:bg-danger/80 border-none shadow-lg shadow-danger/20"
								>
									Review All
								</Button>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Assigned Tasks Card */}
					<GlassCard className="p-0 flex flex-col overflow-hidden">
						<div className="p-4 border-b border-border bg-surface-hover/50 flex justify-between items-center">
							<div className="flex items-center gap-2">
								<Bookmark size={16} className="text-primary" />
								<h3 className="font-bold text-text-main text-sm">
									Assigned to Me
								</h3>
							</div>
							<span className="text-[10px] font-bold text-text-muted bg-surface px-2 py-0.5 rounded-full border border-border">
								{(stats?.assignedTasks || []).length} Pending
							</span>
						</div>
						<div className="p-2 bg-background/30 max-h-[400px] overflow-y-auto scrollbar-custom">
							{!stats?.assignedTasks || stats.assignedTasks.length === 0 ? (
								<div className="p-8 text-center text-text-muted text-xs italic">
									All clear! No tasks currently assigned to you.
								</div>
							) : (
								<div className="grid grid-cols-2 gap-2 md:gap-3">
									{stats.assignedTasks.map((task) => (
										<div
											key={task.id}
											onClick={() => navigate(`/project/${task.projectId}`)}
											className="p-2 md:p-3 bg-surface border border-border rounded-lg md:rounded-xl hover:border-primary transition-all cursor-pointer group"
										>
											<div className="flex justify-between items-start mb-1 md:mb-2">
												<span className="text-[8px] md:text-[9px] font-mono text-text-muted">
													{task.taskId}
												</span>
												<div
													className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${
														task.priority === "Urgent"
															? "bg-danger shadow-[0_0_8px_rgba(239,68,68,0.5)]"
															: task.priority === "High"
																? "bg-warning"
																: "bg-primary"
													}`}
												/>
											</div>
											<h4 className="text-[11px] md:text-xs font-bold text-text-main group-hover:text-primary transition-colors line-clamp-1 leading-tight">
												{task.title}
											</h4>
											<div className="flex items-center gap-2 mt-1.5 md:mt-2">
												<div className="px-1 py-0.5 rounded bg-background border border-border text-[7px] md:text-[8px] font-bold text-text-muted uppercase">
													{task.status}
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</GlassCard>

					{/* Performance & Workload Section */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Velocity Chart */}
						<GlassCard className="p-6 flex flex-col min-h-[350px]">
							<div className="flex justify-between items-center mb-6">
								<div>
									<h3 className="font-bold text-text-main text-sm">
										Workspace Performance
									</h3>
									<p className="text-[10px] text-text-muted">
										Velocity trend across all connected projects
									</p>
								</div>
							</div>
							<BurndownChart data={stats.burndownData} />
						</GlassCard>

						{/* Workload Distribution */}
						<GlassCard className="p-6 flex flex-col min-h-[350px]">
							<div className="flex justify-between items-center mb-6">
								<div>
									<h3 className="font-bold text-text-main text-sm">
										Workload Balance
									</h3>
									<p className="text-[10px] text-text-muted">
										Current task distribution across top contributors
									</p>
								</div>
							</div>
							<WorkloadChart data={stats.workloadData} />
						</GlassCard>
					</div>
				</div>

				{/* Right Column: Activity Feed & Projects */}
				<div className="space-y-8">
					{/* Recent Activity */}
					<GlassCard className="p-0 flex flex-col h-[500px]">
						<div className="p-4 border-b border-border bg-surface-hover/50">
							<h3 className="font-bold text-text-main text-sm">
								Movement Feed
							</h3>
						</div>
						<div className="flex-1 p-4 space-y-6 bg-background/20 overflow-y-auto scrollbar-custom">
							{!stats?.recentActivities ||
							stats.recentActivities.length === 0 ? (
								<div className="flex flex-col items-center justify-center h-full text-text-muted gap-2 opacity-50">
									<Clock size={32} />
									<span className="text-[10px] font-bold uppercase tracking-widest">
										No recent movements
									</span>
								</div>
							) : (
								stats.recentActivities.map((activity) => (
									<div key={activity.id} className="flex gap-3 group">
										<div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
											<Target size={14} />
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex justify-between items-start gap-2">
												<p className="text-[11px] text-text-main leading-tight">
													<span className="font-bold">System</span>{" "}
													{activity.action}{" "}
													<span className="font-bold text-primary">
														{activity.target}
													</span>
												</p>
											</div>
											<span className="text-[9px] text-text-muted mt-1 block">
												{new Date(activity.timestamp).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
												})}
											</span>
										</div>
									</div>
								))
							)}
						</div>
						<button className="w-full py-3 border-t border-border bg-surface-hover/30 text-[10px] font-bold text-text-muted hover:text-text-main transition-all uppercase tracking-widest">
							Full Audit Log
						</button>
					</GlassCard>

					{/* Projects High-Density Grid */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-xs font-extrabold text-primary uppercase tracking-widest">
								Active Workspaces
							</h3>
							<span className="text-[10px] font-bold text-text-muted hover:text-primary cursor-pointer transition-colors">
								View All
							</span>
						</div>
						<div className="space-y-3">
							{projects.slice(0, 4).map((project, idx) => {
								// Simulated progress for demonstration
								const progress = [75, 40, 92, 15][idx % 4];
								const status =
									progress > 70
										? "On Track"
										: progress > 30
											? "Active"
											: "Early Stage";

								return (
									<div
										key={project.id}
										onClick={() => navigate(`/project/${project.id}`)}
										className="p-4 bg-surface border border-border rounded-2xl hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group relative overflow-hidden"
									>
										<div className="flex justify-between items-start mb-3">
											<div className="min-w-0">
												<div className="flex items-center gap-2 mb-1">
													<div className="w-2 h-2 rounded-full bg-primary" />
													<h4 className="text-xs font-black text-text-main group-hover:text-primary transition-colors truncate">
														{project.name}
													</h4>
												</div>
												<p className="text-[9px] text-text-muted font-bold uppercase tracking-wider">
													{project.key} • {status}
												</p>
											</div>
											<ChevronRight
												size={14}
												className="text-text-muted group-hover:translate-x-1 group-hover:text-primary transition-all"
											/>
										</div>

										<div className="space-y-2">
											<div className="flex justify-between items-end">
												<span className="text-[9px] font-bold text-text-muted">
													Sprint Velocity
												</span>
												<span className="text-[10px] font-black text-text-main">
													{progress}%
												</span>
											</div>
											<div className="h-1.5 w-full bg-background rounded-full overflow-hidden border border-border/50">
												<motion.div
													initial={{ width: 0 }}
													animate={{ width: `${progress}%` }}
													className={twMerge(
														"h-full rounded-full",
														progress > 70
															? "bg-success"
															: progress > 30
																? "bg-primary"
																: "bg-warning",
													)}
												/>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
