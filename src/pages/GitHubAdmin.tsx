import React, { useState, useEffect } from "react";
import {
	Trash2,
	Clock,
	ExternalLink,
	GitBranch,
	Building2,
	Shield,
	Users,
} from "lucide-react";
import Badge from "../components/atoms/Badge";
import Button from "../components/atoms/Button";
import GlassCard from "../components/molecules/GlassCard";
import PageHeader from "../components/molecules/PageHeader";
import CodeLoader from "../components/atoms/CodeLoader";

import { useConfirm } from "../hooks/useConfirm";
import { useToast } from "../hooks/useToast";
import { useAuthStore } from "../store/useAuthStore";
import { githubService } from "../services/githubService";
import type { GitHubRepo, GitHubOrg } from "../services/githubService";

const GitHubAdmin: React.FC = () => {
	const { confirm } = useConfirm();
	const { success, error: toastError } = useToast();
	const { isAuthenticated } = useAuthStore();

	const [activeView, setActiveView] = useState<"repos" | "orgs">("repos");
	const [repos, setRepos] = useState<GitHubRepo[]>([]);
	const [orgs, setOrgs] = useState<GitHubOrg[]>([]);
	const [loading, setLoading] = useState(true);
	const hasNotifiedError = React.useRef(false);

	const fetchData = React.useCallback(
		async (isInitialLoad: unknown = false) => {
			if (!isAuthenticated) return;

			// Verify token exists in storage
			const storage = localStorage.getItem("auth-storage");
			const token = storage ? JSON.parse(storage).state?.token : null;

			if (!token) {
				toastError(
					"Authentication Error",
					"Session token is missing. Please sign out and sign in again.",
				);
				setLoading(false);
				return;
			}

			if (isInitialLoad !== true) {
				setLoading(true);
				hasNotifiedError.current = false;
			}

			try {
				const [repoData, orgData] = await Promise.all([
					githubService.getRepositories(),
					githubService.getOrganizations(),
				]);
				setRepos(repoData);
				setOrgs(orgData);
			} catch (err: unknown) {
				console.error("GitHub Fetch Error:", err);
				
				if (!hasNotifiedError.current) {
					let errorMessage = "Could not fetch your GitHub data.";
					const error = err as { response?: { data?: unknown }, request?: unknown, message?: string };
					
					if (error.response) {
						// Server responded with an error
						errorMessage = typeof error.response.data === "string" 
							? error.response.data 
							: (error.response.data as { message?: string })?.message || errorMessage;
					} else if (error.request) {
						// Request was made but no response (Network error / SSL / CORS)
						errorMessage = `Network Error: The server is unreachable. Please ensure the backend is running and you have accepted its SSL certificate at ${import.meta.env.VITE_API_URL}/github/repos`;
					} else {
						errorMessage = error.message || errorMessage;
					}

					toastError("GitHub Connection Failed", errorMessage);
					hasNotifiedError.current = true;
				}
			} finally {
				setLoading(false);
			}
		},
		[toastError, isAuthenticated],
	);

	useEffect(() => {
		const init = async () => {
			await fetchData(true);
		};
		init();
	}, [fetchData]);

	const handleDeleteRepository = async (repoName: string) => {
		const ok = await confirm({
			title: "Disconnect Repository",
			message: `Are you sure you want to disconnect ${repoName}? This will stop all automated pipeline triggers.`,
			confirmText: "Disconnect",
			type: "danger",
		});

		if (ok) {
			success(
				"Repository Disconnected",
				`${repoName} has been removed from the pipeline.`,
			);
		}
	};

	const handleImportTeam = async (orgName: string) => {
		try {
			const result = await githubService.importTeam(orgName);
			success(
				"Team Imported",
				`Successfully created team "${result.name}" with ${result.memberCount} members from GitHub.`
			);
		} catch (err: unknown) {
			console.error("Team Import Error:", err);
			const error = err as { response?: { data?: string | { message?: string } } };
			toastError(
				"Import Failed",
				typeof error.response?.data === "string" 
					? error.response.data 
					: (error.response?.data as { message?: string })?.message || "Could not import organization members as a team."
			);
		}
	};

	return (
		<div className="space-y-8 animate-fade-in pb-10">
			<PageHeader
				title="GitHub Pipeline"
				description="Monitor your connected repositories and organization workspaces."
				actions={
					<div className="flex gap-2">
						<Button
							variant="secondary"
							onClick={() => fetchData()}
							disabled={loading}
							leftIcon={
								loading ? (
									<CodeLoader size="sm" className="w-5 h-5" />
								) : (
									<Clock size={18} />
								)
							}
						>
							Refresh
						</Button>
						<Button
							className="w-full md:w-auto bg-[#2ea44f] hover:shadow-[0_0_20px_rgba(46,164,79,0.4)]"
							leftIcon={<GitBranch size={18} />}
						>
							Connect Repository
						</Button>
					</div>
				}
			/>

			<div className="flex items-center gap-2 mb-2">
				<button
					onClick={() => setActiveView("repos")}
					className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeView === "repos" ? "bg-primary text-slate-900" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
				>
					Your Repositories
				</button>
				<button
					onClick={() => setActiveView("orgs")}
					className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeView === "orgs" ? "bg-primary text-slate-900" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
				>
					Organizations
				</button>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
				<div className="xl:col-span-2 space-y-6">
					<GlassCard
						noPadding
						className="overflow-hidden h-[500px] lg:h-[650px] flex flex-col"
					>
						<div className="px-6 py-4 border-b border-white/[0.05] bg-white/[0.02] flex justify-between items-center shrink-0">
							<h3 className="font-bold text-white capitalize">
								{activeView === "repos"
									? "Available Repositories"
									: "GitHub Organizations"}
							</h3>
							<Badge variant="secondary">
								{loading
									? "..."
									: activeView === "repos"
										? repos.length
										: orgs.length}{" "}
								Total
							</Badge>
						</div>

						<div className="flex-1 overflow-y-auto divide-y divide-white/[0.05] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-primary/20 transition-all">
							{loading ? (
								<div className="h-full flex flex-col items-center justify-center text-slate-500 gap-6">
									<CodeLoader size="lg" />
									<p className="font-mono text-xs uppercase tracking-[0.3em] text-primary/60 animate-pulse">
										Deciphering GitHub Repositories...
									</p>
								</div>
							) : activeView === "repos" ? (
								repos.length === 0 ? (
									<div className="p-20 text-center text-slate-500">
										No repositories found.
									</div>
								) : (
									repos.map((repo) => (
										<div
											key={repo.fullName}
											className="p-6 flex items-center justify-between hover:bg-white/[0.01] transition-all group"
										>
											<div className="flex items-center gap-4">
												<div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/[0.05] flex items-center justify-center text-slate-400 group-hover:border-primary/30 transition-all">
													<GitBranch
														size={24}
														className="group-hover:text-primary transition-colors"
													/>
												</div>
												<div>
													<h4 className="font-bold text-white flex items-center gap-2">
														{repo.name}
														<a
															href={repo.url}
															target="_blank"
															rel="noopener noreferrer"
														>
															<ExternalLink
																size={12}
																className="text-slate-600 hover:text-primary"
															/>
														</a>
													</h4>
													<p className="text-xs text-slate-500 line-clamp-1 max-w-xs md:max-w-md">
														{repo.description || "No description provided."}
													</p>
												</div>
											</div>
											<div className="flex items-center gap-4 md:gap-8 shrink-0 ml-4">
												<div className="hidden sm:block text-right">
													<div className="flex items-center gap-1.5 mb-1 justify-end">
														{repo.isPrivate && (
															<Badge variant="secondary" size="xs">
																Private
															</Badge>
														)}
														<Badge variant="success" size="xs">
															{repo.language || "Markdown"}
														</Badge>
													</div>
													<p className="text-[10px] text-slate-500 uppercase">
														Updated{" "}
														{new Date(repo.updatedAt).toLocaleDateString()}
													</p>
												</div>
												<Button
													variant="ghost"
													size="sm"
													className="text-slate-500 hover:text-rose-500"
													onClick={() => handleDeleteRepository(repo.name)}
												>
													<Trash2 size={18} />
												</Button>
											</div>
										</div>
									))
								)
							) : orgs.length === 0 ? (
								<div className="p-20 text-center text-slate-500">
									No organizations found.
								</div>
							) : (
								orgs.map((org) => (
									<div
										key={org.login}
										className="p-6 flex items-center justify-between hover:bg-white/[0.01] transition-all group"
									>
										<div className="flex items-center gap-4">
											<img
												src={org.avatarUrl}
												alt={org.login}
												className="w-12 h-12 rounded-2xl border border-white/[0.05] group-hover:border-primary/30 transition-all"
											/>
											<div>
												<h4 className="font-bold text-white flex items-center gap-2">
													{org.login}
												</h4>
												<p className="text-xs text-slate-500 line-clamp-1 max-w-xs md:max-w-md">
													{org.description || "GitHub Organization"}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-4 shrink-0 ml-4">
											<Badge variant="secondary" className="hidden sm:flex">
												<Building2 size={12} className="mr-1" /> Verified
											</Badge>
											<Button
												variant="ghost"
												size="sm"
												className="text-primary hover:bg-primary/10 flex items-center gap-2 group/btn"
												onClick={() => handleImportTeam(org.login)}
											>
												<Users size={16} className="group-hover/btn:scale-110 transition-transform" />
												<span>Import as Team</span>
											</Button>
										</div>
									</div>
								))
							)}
						</div>
					</GlassCard>

					<GlassCard className="p-6 border-amber-500/20 bg-amber-500/5">
						<div className="flex items-center gap-3 mb-6">
							<Shield size={20} className="text-amber-400" />
							<h3 className="font-bold text-white">Security & Permissions</h3>
						</div>
						<p className="text-sm text-slate-400 mb-4">
							You are currently using an OAuth token with{" "}
							<code className="text-primary bg-primary/10 px-1 rounded">
								repo
							</code>{" "}
							and{" "}
							<code className="text-primary bg-primary/10 px-1 rounded">
								read:org
							</code>{" "}
							scopes. This allows FlowState to monitor commits and pull
							requests.
						</p>
						<div className="flex gap-4">
							<Button variant="secondary" size="sm">
								Audit Log
							</Button>
							<Button variant="secondary" size="sm">
								Manage Permissions
							</Button>
						</div>
					</GlassCard>
				</div>

				<div className="space-y-6">
					<GlassCard className="p-6">
						<h3 className="font-bold text-white mb-6">Webhook Health</h3>
						<div className="space-y-6">
							<div className="flex items-center gap-4">
								<div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
								<div className="flex-1">
									<p className="text-sm font-bold text-white">
										Project Pipeline
									</p>
									<p className="text-[10px] text-slate-500 uppercase">
										Operational
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
								<div className="flex-1">
									<p className="text-sm font-bold text-white">
										GitHub API Relay
									</p>
									<p className="text-[10px] text-slate-500 uppercase">
										Connected
									</p>
								</div>
							</div>
						</div>
					</GlassCard>

					<GlassCard className="p-6 bg-primary/5 border-primary/20">
						<h3 className="font-bold text-white mb-4">Pipeline Stats</h3>
						<div className="grid grid-cols-2 gap-4">
							<div className="p-3 bg-white/[0.03] rounded-2xl border border-white/[0.05]">
								<p className="text-2xl font-bold text-white">{repos.length}</p>
								<p className="text-[10px] text-slate-500 uppercase">
									Repos Accessible
								</p>
							</div>
							<div className="p-3 bg-white/[0.03] rounded-2xl border border-white/[0.05]">
								<p className="text-2xl font-bold text-white">{orgs.length}</p>
								<p className="text-[10px] text-slate-500 uppercase">
									Orgs Found
								</p>
							</div>
						</div>
					</GlassCard>
				</div>
			</div>
		</div>
	);
};

export default GitHubAdmin;
