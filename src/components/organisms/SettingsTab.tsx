import React, { useState } from "react";
import {
	Globe,
	GitBranch,
	Users,
	Bell,
	Trash2,
	Save,
	Key,
	ExternalLink,
	ShieldAlert,
} from "lucide-react";
import GlassCard from "../molecules/GlassCard";
import Button from "../atoms/Button";
import type { Project } from "../../types";
import { useToast } from "../../hooks/useToast";

interface SettingsTabProps {
	project: Project;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ project }) => {
	const { success, error } = useToast();
	const [projectName, setProjectName] = useState(project.name);
	const [projectDescription, setProjectDescription] = useState(
		project.description,
	);
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);

	const handleSaveGeneral = () => {
		success("Settings Saved", "Project configuration has been updated.");
	};

	const handleDeleteProject = () => {
		if (
			window.confirm(
				"Are you absolutely sure? This action cannot be undone and will delete all tasks and associated data.",
			)
		) {
			error(
				"Restricted",
				"Project deletion is restricted to workspace owners.",
			);
		}
	};

	return (
		<div className="space-y-8 animate-fade-in pb-20 max-w-5xl mx-auto">
			{/* General Configuration */}
			<section className="space-y-4">
				<div className="flex items-center gap-2 mb-2">
					<Globe size={18} className="text-primary" />
					<h3 className="font-bold text-text-main text-sm uppercase tracking-wider">
						General Configuration
					</h3>
				</div>
				<GlassCard className="p-6 space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
								Project Name
							</label>
							<input
								type="text"
								value={projectName}
								onChange={(e) => setProjectName(e.target.value)}
								className="w-full bg-background border border-border rounded-lg p-3 text-sm text-text-main focus:outline-none focus:border-primary transition-colors"
							/>
						</div>
						<div className="space-y-2">
							<label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
								Project Key
							</label>
							<div className="flex items-center gap-2">
								<input
									type="text"
									value={project.key}
									disabled
									className="flex-1 bg-background/50 border border-border rounded-lg p-3 text-sm text-text-muted cursor-not-allowed"
								/>
								<div className="p-3 bg-surface border border-border rounded-lg text-text-muted">
									<Key size={14} />
								</div>
							</div>
						</div>
					</div>
					<div className="space-y-2">
						<label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
							Description
						</label>
						<textarea
							rows={3}
							value={projectDescription}
							onChange={(e) => setProjectDescription(e.target.value)}
							className="w-full bg-background border border-border rounded-lg p-3 text-sm text-text-main focus:outline-none focus:border-primary transition-colors resize-none"
						/>
					</div>
					<div className="flex justify-end pt-2">
						<Button
							variant="primary"
							size="sm"
							leftIcon={<Save size={16} />}
							onClick={handleSaveGeneral}
						>
							Save Changes
						</Button>
					</div>
				</GlassCard>
			</section>

			{/* Source Control Integration */}
			<section className="space-y-4">
				<div className="flex items-center gap-2 mb-2">
					<GitBranch size={18} className="text-text-main" />
					<h3 className="font-bold text-text-main text-sm uppercase tracking-wider">
						Source Control
					</h3>
				</div>
				<GlassCard className="p-6 space-y-4">
					{project.repositories && project.repositories.length > 0 ? (
						project.repositories.map((repo) => (
							<div
								key={repo.id}
								className="flex items-center justify-between p-4 bg-background border border-border rounded-xl"
							>
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-xl bg-surface-hover flex items-center justify-center border border-border shadow-inner">
										<GitBranch size={24} className="text-text-main" />
									</div>
									<div>
										<p className="text-sm font-bold text-text-main">
											{repo.repoName}
										</p>
										<p className="text-[10px] text-text-muted">
											Connected GitHub Repository
										</p>
									</div>
								</div>
								<div className="flex gap-2">
									<Button
										variant="secondary"
										size="xs"
										leftIcon={<ExternalLink size={14} />}
										onClick={() => window.open(repo.repoURL, "_blank")}
									>
										View
									</Button>
									<Button variant="danger" size="xs">
										Unlink
									</Button>
								</div>
							</div>
						))
					) : (
						<div className="p-8 text-center text-text-muted text-xs italic border border-dashed border-border rounded-xl bg-background/20">
							No repositories linked to this workspace.
						</div>
					)}
					<div className="mt-4 p-4 border border-border/50 rounded-xl bg-surface/30">
						<div className="flex items-center justify-between mb-2">
							<span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
								Active Sync Branch
							</span>
							<span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary">
								main
							</span>
						</div>
						<p className="text-[11px] text-text-muted leading-relaxed">
							Automatic synchronization is enabled. Changes to this branch will
							trigger real-time updates in the Repository and Timeline views.
						</p>
					</div>
				</GlassCard>
			</section>

			{/* Access & Notifications */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<section className="space-y-4">
					<div className="flex items-center gap-2 mb-2">
						<Users size={18} className="text-accent-purple" />
						<h3 className="font-bold text-text-main text-sm uppercase tracking-wider">
							Team Access
						</h3>
					</div>
					<GlassCard className="p-6 h-full">
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs font-bold text-text-main">
										Workspace Team
									</p>
									<p className="text-[10px] text-text-muted italic">
										Managed via Workspace Admin
									</p>
								</div>
								<div className="p-2 bg-accent-purple/10 border border-accent-purple/20 rounded-lg text-accent-purple">
									<Users size={16} />
								</div>
							</div>
							<div className="p-3 bg-background border border-border rounded-lg text-[11px] text-text-muted">
								This project is currently shared with the core development team.
							</div>
							<Button variant="secondary" size="sm" className="w-full">
								Manage Team Permissions
							</Button>
						</div>
					</GlassCard>
				</section>

				<section className="space-y-4">
					<div className="flex items-center gap-2 mb-2">
						<Bell size={18} className="text-success" />
						<h3 className="font-bold text-text-main text-sm uppercase tracking-wider">
							Notifications
						</h3>
					</div>
					<GlassCard className="p-6 h-full">
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs font-bold text-text-main">
										Push Notifications
									</p>
									<p className="text-[10px] text-text-muted">
										Receive browser updates
									</p>
								</div>
								<button
									onClick={() => setNotificationsEnabled(!notificationsEnabled)}
									className={`w-10 h-5 rounded-full transition-all relative ${notificationsEnabled ? "bg-success" : "bg-border"}`}
								>
									<div
										className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${notificationsEnabled ? "right-1" : "left-1"}`}
									/>
								</button>
							</div>
							<div className="space-y-3">
								<div className="flex items-center justify-between opacity-50">
									<p className="text-[11px] text-text-main">
										Slack Integration
									</p>
									<span className="text-[9px] font-bold text-text-muted uppercase">
										Coming Soon
									</span>
								</div>
								<div className="flex items-center justify-between opacity-50">
									<p className="text-[11px] text-text-main">Email Digests</p>
									<span className="text-[9px] font-bold text-text-muted uppercase">
										Disabled
									</span>
								</div>
							</div>
						</div>
					</GlassCard>
				</section>
			</div>

			{/* Danger Zone */}
			<section className="space-y-4 pt-8">
				<div className="flex items-center gap-2 mb-2">
					<ShieldAlert size={18} className="text-danger" />
					<h3 className="font-bold text-danger text-sm uppercase tracking-wider">
						Danger Zone
					</h3>
				</div>
				<GlassCard className="p-6 border-danger/20 bg-danger/5">
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						<div>
							<p className="text-xs font-bold text-text-main">
								Delete this project
							</p>
							<p className="text-[10px] text-text-muted">
								Once you delete a project, there is no going back. Please be
								certain.
							</p>
						</div>
						<Button
							variant="danger"
							size="sm"
							leftIcon={<Trash2 size={16} />}
							onClick={handleDeleteProject}
						>
							Delete Project
						</Button>
					</div>
				</GlassCard>
			</section>
		</div>
	);
};

export default SettingsTab;
