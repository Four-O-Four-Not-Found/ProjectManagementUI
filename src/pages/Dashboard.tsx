import React, { useState } from "react";
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
} from "lucide-react";
import PageHeader from "../components/molecules/PageHeader";
import ActivityItem from "../components/molecules/ActivityItem";
import Button from "../components/atoms/Button";
import StatCard from "../components/molecules/StatCard";
import GlassCard from "../components/molecules/GlassCard";
import TaskFormModal from "../components/organisms/TaskFormModal";
import ProjectFormModal from "../components/organisms/ProjectFormModal";
import ActivityDetailModal from "../components/organisms/ActivityDetailModal";
import { MOCK_ACTIVITIES } from "../mocks/data";
import { useToast } from "../hooks/useToast";
import type { Task, Project, Activity } from "../types";
import { projectService } from "../services/projectService";

import BurndownChart from "../components/molecules/BurndownChart";

const Dashboard: React.FC = () => {
	const navigate = useNavigate();
	const { success } = useToast();
	const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
	const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
	const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
		null,
	);

	const [projects, setProjects] = useState<Project[]>([]);

	React.useEffect(() => {
		projectService.getProjects().then(setProjects).catch(console.error);
	}, []);

	const handleCreateTask = (data: Partial<Task>) => {
		success(
			"Task Dispatched",
			`Entry "${data.title}" has been added to the backlog.`,
		);
		setIsTaskModalOpen(false);
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

	return (
		<div className="space-y-8 animate-fade-in pb-10">
			<TaskFormModal
				key="dashboard-new-task"
				isOpen={isTaskModalOpen}
				onClose={() => setIsTaskModalOpen(false)}
				onSave={handleCreateTask}
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
						Welcome back! Here's what's happening with{" "}
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
								success("Report Generating", "Compiling workspace metrics...")
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

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					label="Total Tasks"
					value="128"
					icon={CheckCircle2}
					colorClass="bg-primary"
					trend="+12%"
				/>
				<StatCard
					label="Active Sprints"
					value="3"
					icon={Clock}
					colorClass="bg-merged"
				/>
				<StatCard
					label="Team Members"
					value="24"
					icon={Users}
					colorClass="bg-primary"
				/>
				<StatCard
					label="PRs Open"
					value="12"
					icon={GitBranch}
					colorClass="bg-danger"
					trend="+4"
				/>
			</div>

			{/* Main Stats & Charts Section */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Burndown Chart Card */}
				<GlassCard className="lg:col-span-2 p-6 flex flex-col min-h-[400px]">
					<div className="flex justify-between items-center mb-4">
						<div>
							<h3 className="font-bold text-text-main text-sm">
								Sprint Velocity
							</h3>
							<p className="text-[10px] text-text-muted">
								Real-time burndown performance across active sprint
							</p>
						</div>
						<div className="flex gap-2">
							<div className="flex items-center gap-1.5">
								<div className="w-2 h-2 rounded-full bg-primary" />
								<span className="text-[9px] text-text-muted">Actual</span>
							</div>
							<div className="flex items-center gap-1.5">
								<div className="w-2 h-2 rounded-full bg-border" />
								<span className="text-[9px] text-text-muted">Ideal</span>
							</div>
						</div>
					</div>
					<BurndownChart />
				</GlassCard>

				{/* Recent Activity Card */}
				<GlassCard className="p-0 flex flex-col">
					<div className="p-4 border-b border-border bg-surface-hover">
						<h3 className="font-bold text-text-main text-sm">
							Recent Activity
						</h3>
					</div>
					<div className="flex-1 p-4 space-y-6 bg-background overflow-y-auto max-h-[350px] scrollbar-custom">
						{MOCK_ACTIVITIES.map((activity) => (
							<ActivityItem
								key={activity.id}
								activity={activity}
								onClick={(a) => setSelectedActivity(a)}
							/>
						))}
					</div>
					<button className="w-full py-3 border-t border-border bg-surface-hover text-xs font-bold text-text-muted hover:text-text-main transition-all">
						View Detailed Audit Log
					</button>
				</GlassCard>
			</div>

			{/* Projects List Section */}
			<GlassCard className="p-0 flex flex-col">
				<div className="p-4 border-b border-border flex justify-between items-center bg-surface-hover">
					<h3 className="font-bold text-text-main text-sm">
						Active Workspaces
					</h3>
					<Button
						size="xs"
						variant="secondary"
						onClick={() => setIsProjectModalOpen(true)}
					>
						Initialize New
					</Button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 p-2 bg-background">
					{projects.length === 0 ? (
						<div className="p-8 text-center text-text-muted text-sm col-span-full">
							No projects yet. Create one to get started!
						</div>
					) : (
						projects.map((project) => (
							<div
								key={project.id}
								onClick={() => navigate(`/project/${project.id}`)}
								className="flex items-center gap-4 p-4 rounded-md hover:bg-surface border border-transparent hover:border-border transition-all cursor-pointer group"
							>
								<div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
									<Target size={20} />
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<h4 className="font-bold text-text-main group-hover:text-primary transition-colors">
											{project.name}
										</h4>
										<span className="text-[10px] px-1.5 py-0.5 bg-surface border border-border rounded font-mono text-text-muted">
											{project.key}
										</span>
									</div>
									<p className="text-xs text-text-muted mt-1 truncate">
										{project.description}
									</p>
								</div>
								<ChevronRight
									size={18}
									className="text-text-muted group-hover:text-text-main transform group-hover:translate-x-1 transition-all"
								/>
							</div>
						))
					)}
				</div>
			</GlassCard>
		</div>
	);
};

export default Dashboard;
