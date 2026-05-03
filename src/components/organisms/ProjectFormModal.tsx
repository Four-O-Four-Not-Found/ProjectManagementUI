import React, { useState, useEffect, useCallback } from "react";
import BaseModal from "../molecules/BaseModal";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { Target, Hash, GitBranch, Search, Check, Users } from "lucide-react";
import { githubService, type GitHubRepo } from "../../services/githubService";
import teamService, { type Team } from "../../services/teamService";
import { useAuthStore } from "../../store/useAuthStore";
import type { Project } from "../../types";

interface ProjectFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (
		data: Partial<Project> & {
			gitHubRepoName?: string;
			teamId?: string;
			ownerId?: string;
			ownerType?: "User" | "Team";
		},
	) => void;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
	isOpen,
	onClose,
	onSave,
}) => {
	const { user } = useAuthStore();
	const [loading, setLoading] = useState(false);
	const [repos, setRepos] = useState<GitHubRepo[]>([]);
	const [teams, setTeams] = useState<Team[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);

	const [formData, setFormData] = useState<Partial<Project>>({
		name: "",
		key: "",
		description: "",
		teamId: "",
	});

	const fetchData = useCallback(async () => {
		setLoading(true);
		try {
			// Fetch teams first as they are critical for the current issue
			if (user) {
				console.log(
					"[ProjectFormModal] Initiating team fetch for user:",
					user.id,
				);
				teamService
					.getMyTeams()
					.then((data) => {
						console.log("[ProjectFormModal] Team API Success:", data);
						setTeams(Array.isArray(data) ? data : []);
					})
					.catch((err) => {
						console.error("[ProjectFormModal] Team API Error:", err);
						setTeams([]);
					});
			}

			// Fetch repos separately
			console.log("[ProjectFormModal] Initiating repo fetch...");
			githubService
				.getRepositories()
				.then((data) => {
					console.log(
						"[ProjectFormModal] Repo API Success:",
						data.length,
						"repos",
					);
					setRepos(data);
				})
				.catch((err) => {
					console.error("[ProjectFormModal] Repo API Error:", err);
					setRepos([]);
				});
		} catch (err) {
			console.error("[ProjectFormModal] Unexpected fetchData Error:", err);
		} finally {
			setLoading(false);
		}
	}, [user]);

	useEffect(() => {
		if (isOpen) {
			// Defer to avoid cascading renders warning
			const timer = setTimeout(() => {
				fetchData();
			}, 0);
			return () => clearTimeout(timer);
		}
	}, [isOpen, fetchData]);

	const filteredRepos = repos.filter(
		(repo) =>
			repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			repo.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave({
			...formData,
			teamId: formData.teamId || undefined,
			gitHubRepoName: selectedRepo?.fullName,
			ownerId: user?.id,
			ownerType: "User",
		});
		onClose();
	};

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Initialize New Project"
			footer={
				<>
					<Button variant="secondary" onClick={onClose}>
						Cancel
					</Button>
					<Button variant="success" onClick={handleSubmit} disabled={!formData.name}>
						Create Project
					</Button>
				</>
			}
		>
			<div className="max-w-2xl">
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="md:col-span-2">
							<Input
								label="Project Name"
								placeholder="e.g. Orion Infrastructure"
								icon={<Target size={16} />}
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								required
							/>
						</div>
						<Input
							label="Key (Optional)"
							placeholder="e.g. ORN"
							icon={<Hash size={16} />}
							value={formData.key}
							onChange={(e) => {
								const val = e.target.value.toUpperCase().slice(0, 5);
								setFormData({ ...formData, key: val });
							}}
							helperText="Leave empty to auto-generate from name"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-[10px] font-bold text-muted uppercase tracking-widest block ml-1">
							Connect GitHub Repository (Optional)
						</label>
						<div className="relative group">
							<div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
								<Search size={16} />
							</div>
							<input
								type="text"
								placeholder="Search your repositories..."
								className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl pl-12 pr-4 py-3 text-sm text-main outline-none focus:border-primary/50 transition-all"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<div className="h-48 overflow-y-auto rounded-2xl border border-white/[0.05] bg-white/[0.02] divide-y divide-white/[0.05] scrollbar-thin scrollbar-thumb-white/10">
							{loading ? (
								<div className="h-full flex items-center justify-center text-slate-500 text-xs font-mono animate-pulse">
									Fetching Repositories...
								</div>
							) : filteredRepos.length === 0 ? (
								<div className="h-full flex items-center justify-center text-slate-500 text-xs">
									No repositories found
								</div>
							) : (
								filteredRepos.map((repo) => (
									<div
										key={repo.fullName}
										className={`p-3 flex items-center justify-between cursor-pointer hover:bg-white/[0.03] transition-all ${selectedRepo?.fullName === repo.fullName ? "bg-primary/5" : ""}`}
										onClick={() => setSelectedRepo(repo)}
									>
										<div className="flex items-center gap-3">
											<div
												className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${selectedRepo?.fullName === repo.fullName ? "border-primary/50 bg-primary/10 text-primary" : "border-white/[0.05] bg-slate-900 text-slate-400"}`}
											>
												<GitBranch size={14} />
											</div>
											<div>
												<p
													className={`text-sm font-bold transition-colors ${selectedRepo?.fullName === repo.fullName ? "text-primary" : "text-white"}`}
												>
													{repo.name}
												</p>
												<p className="text-[10px] text-slate-500">
													{repo.fullName}
												</p>
											</div>
										</div>
										{selectedRepo?.fullName === repo.fullName && (
											<div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary animate-scale-in">
												<Check size={14} />
											</div>
										)}
									</div>
								))
							)}
						</div>
					</div>

					<div className="space-y-2">
						<label className="text-[10px] font-bold text-muted uppercase tracking-widest block ml-1 flex items-center gap-2">
							<Users size={12} />
							Assign Team (Optional)
						</label>
						<select
							className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-4 py-3 text-sm text-main outline-none focus:border-primary/50 transition-all appearance-none"
							value={formData.teamId || ""}
							onChange={(e) =>
								setFormData({ ...formData, teamId: e.target.value })
							}
						>
							<option value="" className="bg-slate-900">
								No Team Assigned
							</option>
							{teams.map((team) => (
								<option key={team.id} value={team.id} className="bg-slate-900">
									{team.name}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-2">
						<label className="text-[10px] font-bold text-muted uppercase tracking-widest block ml-1">
							Project Description
						</label>
						<textarea
							className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 text-sm text-main outline-none focus:border-primary/50 transition-all min-h-[80px] resize-none"
							placeholder="What is the mission of this project?"
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
						/>
					</div>
				</form>
			</div>
		</BaseModal>
	);
};

export default ProjectFormModal;
