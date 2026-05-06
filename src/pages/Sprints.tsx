import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
	Calendar,
	Clock,
	CheckCircle2,
	Plus,
	ChevronRight,
	AlertCircle,
	BarChart3,
	Target,
} from "lucide-react";
import PageHeader from "../components/molecules/PageHeader";
import Button from "../components/atoms/Button";
import GlassCard from "../components/molecules/GlassCard";
import SprintFormModal from "../components/organisms/SprintFormModal";
import type { Sprint, Project } from "../types";
import { projectService } from "../services/projectService";
import { useToast } from "../hooks/useToast";
import LoadingScreen from "../components/organisms/LoadingScreen";

const Sprints: React.FC = () => {
	const { projectId } = useParams<{ projectId: string }>();
	const { success } = useToast();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [project, setProject] = useState<Project | null>(null);
	const [sprints, setSprints] = useState<Sprint[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (projectId) {
			Promise.all([
				projectService.getProjectBoard(projectId),
				projectService.getSprints(projectId),
			])
				.then((results) => {
					const [projectData, sprintsData] = results;
					setProject(projectData);
					setSprints(sprintsData || []);
					setLoading(false);
				})
				.catch((err) => {
					console.error("Sprint load failed", err);
					setLoading(false);
				});
		}
	}, [projectId]);

	const handleCreateSprint = (data: Partial<Sprint>) => {
		success(
			"Sprint Scheduled",
			`Sprint "${data.name}" has been added to the roadmap.`,
		);
		setIsModalOpen(false);
		if (projectId) projectService.getSprints(projectId).then(setSprints);
	};

	if (loading || !project) return <LoadingScreen />;

	const activeSprint = sprints.find((s) => s.status === "Active");

	return (
		<div className="space-y-8 animate-fade-in pb-10">
			<SprintFormModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleCreateSprint}
			/>

			<PageHeader
				title={`${project.name} Sprints`}
				description="Manage your development cycles and iteration goals."
				actions={
					<Button
						variant="primary"
						leftIcon={<Plus size={18} />}
						onClick={() => setIsModalOpen(true)}
					>
						New Sprint
					</Button>
				}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Active Sprint Summary */}
				<GlassCard className="p-6 border-primary/20 bg-primary/5 col-span-1 lg:col-span-1">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
							<Target size={20} />
						</div>
						<div>
							<h3 className="text-sm font-bold text-text-main uppercase tracking-widest">
								Active
							</h3>
							<p className="text-[10px] text-text-muted">Current Iteration</p>
						</div>
					</div>
					{activeSprint ? (
						<div className="space-y-4">
							<div className="p-3 bg-surface border border-primary/30 rounded-xl">
								<p className="text-xs font-bold text-text-main mb-1">
									{activeSprint.name}
								</p>
								<div className="flex items-center gap-2 text-[10px] text-text-muted">
									<Clock size={12} />
									<span>
										Ends {new Date(activeSprint.endDate).toLocaleDateString()}
									</span>
								</div>
							</div>
						</div>
					) : (
						<div className="p-4 text-center border border-dashed border-primary/30 rounded-xl">
							<p className="text-[10px] text-text-muted italic">
								No active sprint
							</p>
						</div>
					)}
				</GlassCard>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 col-span-1 lg:col-span-3 gap-6">
					<GlassCard className="p-6 flex flex-col justify-center">
						<BarChart3 size={24} className="text-primary mb-3" />
						<h4 className="text-2xl font-bold text-text-main">
							{sprints.length > 0
								? (
										sprints.reduce(
											(acc, s) => acc + (s.tasks?.length || 0),
											0,
										) / sprints.length
									).toFixed(1)
								: 0}
						</h4>
						<p className="text-[10px] text-text-muted uppercase font-bold">
							Avg Velocity
						</p>
					</GlassCard>
					<GlassCard className="p-6 flex flex-col justify-center">
						<CheckCircle2 size={24} className="text-primary mb-3" />
						<h4 className="text-2xl font-bold text-text-main">
							{sprints.filter((s) => s.status === "Completed").length}
						</h4>
						<p className="text-[10px] text-text-muted uppercase font-bold">
							Sprints Completed
						</p>
					</GlassCard>
					<GlassCard className="p-6 flex flex-col justify-center">
						<AlertCircle size={24} className="text-primary mb-3" />
						<h4 className="text-2xl font-bold text-text-main">0</h4>
						<p className="text-[10px] text-text-muted uppercase font-bold">
							Blocked Items
						</p>
					</GlassCard>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-8">
				<GlassCard className="p-0 overflow-hidden">
					<div className="p-4 border-b border-primary/30 bg-[var(--accent-primary)]/10 flex justify-between items-center">
						<h3 className="text-sm font-bold text-text-main flex items-center gap-2">
							<Calendar size={16} className="text-primary" />
							Iteration Roadmap
						</h3>
					</div>
					<div className="divide-y divide-border">
						{sprints.length === 0 ? (
							<div className="p-12 text-center text-text-muted italic">
								No sprints have been initialized for this project yet.
							</div>
						) : (
							sprints.map((sprint, i) => (
								<div
									key={sprint.id}
									className="p-4 hover:bg-[var(--accent-primary)]/10 transition-all flex items-center justify-between group cursor-pointer"
								>
									<div className="flex items-center gap-4">
										<div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center text-text-muted group-hover:border-primary group-hover:text-primary transition-all">
											<span className="text-xs font-bold">{i + 1}</span>
										</div>
										<div>
											<h4 className="text-sm font-bold text-text-main">
												{sprint.name}
											</h4>
											<p className="text-[10px] text-text-muted italic">
												{new Date(sprint.startDate).toLocaleDateString()} -{" "}
												{new Date(sprint.endDate).toLocaleDateString()}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-6">
										<div className="hidden md:flex flex-col items-end">
											<span className="text-[10px] font-bold text-text-main">
												{sprint.tasks?.length || 0} Issues
											</span>
											<span className="text-[9px] text-text-muted uppercase">
												Focus Cycle
											</span>
										</div>
										<div
											className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${sprint.status === "Active" ? "bg-primary/10 text-primary border border-primary/20" : "bg-surface border border-primary/30 text-text-muted"}`}
										>
											{sprint.status}
										</div>
										<ChevronRight
											size={16}
											className="text-text-muted group-hover:translate-x-1 transition-transform"
										/>
									</div>
								</div>
							))
						)}
					</div>
				</GlassCard>
			</div>
		</div>
	);
};

export default Sprints;
