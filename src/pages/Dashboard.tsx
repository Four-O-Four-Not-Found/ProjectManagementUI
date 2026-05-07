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
import teamService, { type Team } from "../services/teamService";
import apiClient from "../services/apiClient";
import BurndownChart from "../components/molecules/BurndownChart";
import WorkloadChart from "../components/molecules/WorkloadChart";
import { useAuthStore } from "../store/useAuthStore";
import EmptyState from "../components/molecules/EmptyState";

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
	const [teams, setTeams] = useState<Team[]>([]);
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [filterUrgentOnly, setFilterUrgentOnly] = useState(false);

	useEffect(() => {
		const loadDashboardData = async () => {
			setLoading(true);
			try {
				const [projectsData, teamsData, statsData] = await Promise.all([
					projectService.getProjects(),
					teamService.getMyTeams(),
					apiClient
						.get<DashboardStats>("/dashboard/stats")
						.then((res) => res.data),
				]);
				setProjects(projectsData);
				setTeams(teamsData);
				setStats(statsData);
			} catch (error) {
				console.error("Dashboard load failed", error);
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
			success("Project Initialized", `Project "${data.name}" is now live.`);
			setProjects([...projects, newProject]);
			setIsProjectModalOpen(false);
		} catch (error) {
			console.error("Failed to create project", error);
		}
	};

	if (loading || !stats) {
		return (
			<div className="space-y-8 animate-fade-in p-6">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className="h-32 bg-[#1e293b] border border-[#334155] rounded-lg" />
					))}
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-8">
						<div className="h-[400px] bg-[#1e293b] border border-[#334155] rounded-lg" />
						<div className="h-[350px] bg-[#1e293b] border border-[#334155] rounded-lg" />
					</div>
					<div className="space-y-8">
						<div className="h-[500px] bg-[#1e293b] border border-[#334155] rounded-lg" />
						<div className="h-64 bg-[#1e293b] border border-[#334155] rounded-lg" />
					</div>
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
					title="No Projects Found"
					description="Your project board is currently empty. Initialize your first project to start tracking tasks and sprints."
					actionLabel="Create First Project"
					onAction={() => setIsProjectModalOpen(true)}
					className="max-w-2xl mx-auto bg-[#1e293b] border border-[#334155]"
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
				title="Overview"
				description={
					<>
						Welcome back,{" "}
						<span className="text-[#38bdf8] font-black">
							{user?.displayName || "Agent"}
						</span>
						. Here's your current operations status.
					</>
				}
				actions={
					<>
						<Button
							variant="secondary"
							className="flex-1 md:flex-none bg-[#334155] border-[#475569] text-white hover:bg-[#475569]"
							leftIcon={<FileText size={16} />}
							onClick={() =>
								info("Report Generating", "Compiling project metrics...")
							}
						>
							Report
						</Button>
						<Button
							variant="success"
							className="flex-1 md:flex-none bg-[#38bdf8] text-[#0f172a] hover:bg-[#7dd3fc]"
							leftIcon={<Target size={16} />}
							onClick={() => setIsProjectModalOpen(true)}
						>
							Project
						</Button>
						<Button
							variant="success"
							className="flex-1 md:flex-none bg-[#38bdf8] text-[#0f172a] hover:bg-[#7dd3fc]"
							leftIcon={<Plus size={16} />}
							onClick={() => setIsTaskModalOpen(true)}
						>
							Task
						</Button>
					</>
				}
			/>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
				<StatCard
					label="Total Tasks"
					value={stats.totalTasks.toString()}
					icon={CheckCircle2}
					trend="+12%"
				/>
				<StatCard
					label="Active Sprints"
					value={stats.activeSprints.toString()}
					icon={Clock}
					colorClass="bg-[#0284c7]"
				/>
				<StatCard
					label="Joined Teams"
					value={stats.teamMembers.toString()}
					icon={Users}
					colorClass="bg-[#38bdf8]"
				/>
				<StatCard
					label="PRs Open"
					value={stats.openPullRequests.toString()}
					icon={GitBranch}
					trend="+4"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left Column: Assigned Tasks & Stats */}
				<div className="lg:col-span-2 space-y-8">
					<AnimatePresence>
						{urgentTasks.length > 0 && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								className="bg-[#38bdf8]/10 border border-[#38bdf8]/30 rounded-lg p-4 flex items-center gap-4 overflow-hidden"
							>
								<div className="w-10 h-10 rounded bg-[#38bdf8]/20 flex items-center justify-center text-[#38bdf8] shrink-0">
									<AlertTriangle size={20} />
								</div>
								<div className="flex-1 min-w-0">
									<h4 className="text-sm font-black text-[#38bdf8] uppercase tracking-wider">
										Priority Alert
									</h4>
									<p className="text-xs text-[#38bdf8]/80">
										You have {urgentTasks.length} critical tasks requiring attention.
									</p>
								</div>
								<Button
									size="xs"
									className="bg-[#38bdf8] text-[#0f172a] hover:bg-[#7dd3fc] font-bold"
									onClick={() => {
										setFilterUrgentOnly(true);
										document.getElementById("assigned-section")?.scrollIntoView({ behavior: "smooth" });
									}}
								>
									Review
								</Button>
							</motion.div>
						)}
					</AnimatePresence>

					<GlassCard id="assigned-section" className="p-0 flex flex-col overflow-hidden bg-[#1e293b] border-[#334155]">
						<div className="p-4 border-b border-[#334155] bg-[#0f172a]/30 flex justify-between items-center">
							<div className="flex items-center gap-2">
								<Bookmark size={16} className="text-[#38bdf8]" />
								<h3 className="font-bold text-[#f8fafc] text-sm uppercase tracking-wider">
									{filterUrgentOnly ? "Critical Operations" : "Current Assignments"}
								</h3>
							</div>
							<div className="flex items-center gap-3">
								{filterUrgentOnly && (
									<button 
										onClick={() => setFilterUrgentOnly(false)}
										className="text-[10px] font-bold text-[#38bdf8] hover:underline uppercase tracking-widest"
									>
										Reset
									</button>
								)}
								<span className="text-[10px] font-bold text-[#94a3b8] bg-[#0f172a] px-2 py-0.5 rounded border border-[#334155] uppercase tracking-tighter">
									{filterUrgentOnly ? urgentTasks.length : (stats?.assignedTasks || []).length} Units
								</span>
							</div>
						</div>
						<div className="p-4 bg-[#0f172a]/20 max-h-[400px] overflow-y-auto scrollbar-custom">
							{!stats?.assignedTasks || stats.assignedTasks.length === 0 ? (
								<div className="p-8 text-center text-[#94a3b8] text-xs italic">
									No pending assignments found.
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{(filterUrgentOnly ? urgentTasks : stats.assignedTasks).map((task) => (
										<div
											key={task.id}
											onClick={() => navigate(`/project/${task.projectId}`)}
											className="p-3 bg-[#1e293b] border border-[#334155] rounded-lg hover:border-[#38bdf8]/50 transition-all cursor-pointer group"
										>
											<div className="flex justify-between items-start mb-2">
												<span className="text-[10px] font-mono text-[#94a3b8] uppercase">
													{task.taskKey}
												</span>
												<div
													className={`w-2 h-2 rounded-full ${
														task.priority === "Urgent"
															? "bg-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.4)]"
															: "bg-[#38bdf8]/40"
													}`}
												/>
											</div>
											<h4 className="text-[13px] font-bold text-[#f8fafc] group-hover:text-[#38bdf8] transition-colors line-clamp-1 leading-tight">
												{task.title}
											</h4>
											<div className="flex items-center gap-2 mt-3">
												<div className="px-2 py-0.5 rounded bg-[#0f172a] border border-[#334155] text-[8px] font-black text-[#94a3b8] uppercase tracking-widest">
													{task.status}
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</GlassCard>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<GlassCard className="p-6 flex flex-col min-h-[350px] bg-[#1e293b] border-[#334155]">
							<div className="mb-6">
								<h3 className="font-bold text-[#f8fafc] text-sm uppercase tracking-wider">
									Velocity Tracking
								</h3>
								<p className="text-[10px] text-[#94a3b8] uppercase tracking-tighter">
									Historical sprint performance metrics
								</p>
							</div>
							<BurndownChart data={stats.burndownData} />
						</GlassCard>

						<GlassCard className="p-6 flex flex-col min-h-[350px] bg-[#1e293b] border-[#334155]">
							<div className="mb-6">
								<h3 className="font-bold text-[#f8fafc] text-sm uppercase tracking-wider">
									Resource Allocation
								</h3>
								<p className="text-[10px] text-[#94a3b8] uppercase tracking-tighter">
									Contributor task distribution
								</p>
							</div>
							<WorkloadChart data={stats.workloadData} />
						</GlassCard>
					</div>
				</div>

				{/* Right Column: Activity Feed & Projects */}
				<div className="space-y-8">
					<GlassCard className="p-0 flex flex-col h-[500px] bg-[#1e293b] border-[#334155]">
						<div className="p-4 border-b border-[#334155] bg-[#0f172a]/30">
							<h3 className="font-bold text-[#f8fafc] text-sm uppercase tracking-wider">
								System Ledger
							</h3>
						</div>
						<div className="flex-1 p-4 space-y-6 bg-[#0f172a]/10 overflow-y-auto scrollbar-custom">
							{!stats?.recentActivities ||
							stats.recentActivities.length === 0 ? (
								<div className="flex flex-col items-center justify-center h-full text-[#94a3b8] gap-2 opacity-50">
									<Clock size={32} />
									<span className="text-[10px] font-bold uppercase tracking-widest">
										Ledger Empty
									</span>
								</div>
							) : (
								stats.recentActivities.map((activity) => (
									<div key={activity.id} className="flex gap-3 group">
										<div className="w-8 h-8 rounded bg-[#334155] border border-[#475569] flex items-center justify-center text-[#38bdf8] shrink-0">
											<Target size={14} />
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex justify-between items-start gap-2">
												<p className="text-[11px] text-[#f8fafc] leading-tight">
													<span className="text-[#94a3b8]">Entry:</span>{" "}
													{activity.action}{" "}
													<span className="font-bold text-[#38bdf8]">
														{activity.target}
													</span>
												</p>
											</div>
											<span className="text-[9px] text-[#94a3b8] font-mono mt-1 block uppercase">
												{new Date(activity.createdAt).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
													hour12: false
												})}
											</span>
										</div>
									</div>
								))
							)}
						</div>
						<button className="w-full py-3 border-t border-[#334155] bg-[#0f172a]/40 text-[10px] font-bold text-[#94a3b8] hover:text-[#38bdf8] transition-all uppercase tracking-widest">
							Access Full Audit Log
						</button>
					</GlassCard>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-[11px] font-black text-[#38bdf8] uppercase tracking-[0.2em]">
								Active Portfolio
							</h3>
							<span className="text-[10px] font-bold text-[#94a3b8] hover:text-[#38bdf8] cursor-pointer transition-colors uppercase">
								Expand
							</span>
						</div>
						<div className="space-y-3">
							{projects.slice(0, 4).map((project, idx) => {
								const progress = [75, 40, 92, 15][idx % 4];
								const status =
									progress > 70
										? "Stable"
										: progress > 30
											? "Operational"
											: "Initializing";

								return (
									<div
										key={project.id}
										onClick={() => navigate(`/project/${project.id}`)}
										className="p-4 bg-[#1e293b] border border-[#334155] rounded-lg hover:border-[#38bdf8]/40 transition-all cursor-pointer group relative"
									>
										<div className="flex justify-between items-start mb-3">
											<div className="min-w-0">
												<div className="flex items-center gap-2 mb-1">
													<div className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
													<h4 className="text-[13px] font-bold text-[#f8fafc] group-hover:text-[#38bdf8] transition-colors truncate">
														{project.name}
													</h4>
												</div>
												<p className="text-[9px] text-[#94a3b8] font-bold uppercase tracking-widest">
													{project.key} • {status}
												</p>
											</div>
											<span className="text-[10px] font-mono text-[#94a3b8]">
												{progress}%
											</span>
										</div>
										<div className="h-1 bg-[#0f172a] rounded-full overflow-hidden">
											<motion.div
												initial={{ width: 0 }}
												animate={{ width: `${progress}%` }}
												className="h-full bg-[#38bdf8]"
											/>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-[11px] font-black text-[#38bdf8] uppercase tracking-[0.2em]">
								Connected Teams
							</h3>
							<span className="text-[10px] font-bold text-[#94a3b8] hover:text-[#38bdf8] cursor-pointer transition-colors uppercase" onClick={() => navigate('/team')}>
								Registry
							</span>
						</div>
						<div className="space-y-3">
							{teams.length === 0 ? (
								<div className="p-4 border border-dashed border-[#334155] rounded-lg text-center bg-[#0f172a]/20">
									<p className="text-[10px] text-[#94a3b8] italic font-medium uppercase tracking-widest">No active connections.</p>
								</div>
							) : (
								teams.slice(0, 3).map((team) => (
									<div
										key={team.id}
										className="p-3 bg-[#1e293b] border border-[#334155] rounded-lg hover:border-[#38bdf8]/40 transition-all flex items-center gap-3 group cursor-pointer"
										onClick={() => navigate('/team')}
									>
										<div className="w-10 h-10 rounded bg-[#0f172a] border border-[#334155] flex items-center justify-center text-[#38bdf8] shrink-0 group-hover:border-[#38bdf8]/40 transition-colors">
											<Users size={18} />
										</div>
										<div className="flex-1 min-w-0">
											<h4 className="text-[13px] font-bold text-[#f8fafc] truncate">
												{team.name}
											</h4>
											<p className="text-[9px] text-[#94a3b8] uppercase tracking-tighter">
												{team.members?.length || 0} Operators
											</p>
										</div>
										<ChevronRight size={14} className="text-[#334155] group-hover:text-[#38bdf8] transition-colors" />
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
