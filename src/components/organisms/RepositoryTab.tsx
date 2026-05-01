import React, { useEffect, useState } from "react";
import {
	GitBranch,
	GitCommit,
	GitPullRequest,
	ExternalLink,
	Loader2,
} from "lucide-react";
import { githubService } from "../../services/githubService";
import type {
	GitHubBranch,
	GitHubCommit,
	GitHubPullRequest,
} from "../../services/githubService";

interface RepositoryTabProps {
	gitHubRepo: string;
}

const RepositoryTab: React.FC<RepositoryTabProps> = ({ gitHubRepo }) => {
	const [branches, setBranches] = useState<GitHubBranch[]>([]);
	const [commits, setCommits] = useState<GitHubCommit[]>([]);
	const [pullRequests, setPullRequests] = useState<GitHubPullRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let isMounted = true;
		const loadRepoData = async () => {
			setLoading(true);
			try {
				const parts = gitHubRepo.split("/");
				if (parts.length === 2) {
					const [owner, repo] = parts;
					const [b, c, prs] = await Promise.all([
						githubService.getBranches(owner, repo),
						githubService.getCommits(owner, repo),
						githubService.getPullRequests(owner, repo),
					]);
					if (isMounted) {
						setBranches(b);
						setCommits(c);
						setPullRequests(prs);
					}
				} else {
					setError("Invalid repository format.");
				}
			} catch {
				if (isMounted) setError("Failed to load repository data.");
			} finally {
				if (isMounted) setLoading(false);
			}
		};
		loadRepoData();

		return () => {
			isMounted = false;
		};
	}, [gitHubRepo]);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64 text-text-muted">
				<Loader2 className="animate-spin mr-2" size={24} /> Loading repository
				data...
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center h-64 text-danger font-bold">
				{error}
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-fade-in pb-10">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface border border-border p-4 rounded-lg">
				<div>
					<h3 className="text-sm font-bold text-text-muted uppercase tracking-widest">
						Connected Repository
					</h3>
					<div className="flex items-center gap-2 mt-1">
						<span className="text-xl font-bold text-text-main">
							{gitHubRepo}
						</span>
						<a
							href={`https://github.com/${gitHubRepo}`}
							target="_blank"
							rel="noopener noreferrer"
							className="p-1.5 rounded-md hover:bg-background text-text-muted hover:text-primary transition-colors"
						>
							<ExternalLink size={18} />
						</a>
					</div>
				</div>
				<div className="flex items-center gap-6 text-sm">
					<div className="flex flex-col">
						<span className="text-text-muted text-[10px] font-bold uppercase tracking-tighter">
							Total Branches
						</span>
						<span className="text-text-main font-bold">{branches.length}</span>
					</div>
					<div className="w-px h-8 bg-border"></div>
					<div className="flex flex-col">
						<span className="text-text-muted text-[10px] font-bold uppercase tracking-tighter">
							Open Pull Requests
						</span>
						<span className="text-accent-purple font-bold">
							{pullRequests.length}
						</span>
					</div>
					<div className="w-px h-8 bg-border"></div>
					<div className="flex flex-col">
						<span className="text-text-muted text-[10px] font-bold uppercase tracking-tighter">
							Recent Commits
						</span>
						<span className="text-success font-bold">{commits.length}</span>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Branches */}
				<div className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col">
					<div className="p-4 border-b border-border bg-surface-hover flex items-center gap-2">
						<GitBranch size={16} className="text-primary" />
						<h3 className="font-bold text-text-main text-sm">Branches</h3>
						<span className="ml-auto text-xs font-bold text-text-muted bg-background px-2 py-0.5 rounded-full">
							{branches.length}
						</span>
					</div>
					<div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[400px] scrollbar-custom">
						{branches.map((b) => (
							<div
								key={b.name}
								className="flex flex-col p-3 rounded-md hover:bg-background transition-colors border border-transparent hover:border-border"
							>
								<span className="font-bold text-sm text-text-main">
									{b.name}
								</span>
								<span className="text-[10px] text-text-muted font-mono">
									{b.commitSha.substring(0, 7)}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Pull Requests */}
				<div className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col">
					<div className="p-4 border-b border-border bg-surface-hover flex items-center gap-2">
						<GitPullRequest size={16} className="text-accent-purple" />
						<h3 className="font-bold text-text-main text-sm">Pull Requests</h3>
						<span className="ml-auto text-xs font-bold text-text-muted bg-background px-2 py-0.5 rounded-full">
							{pullRequests.length}
						</span>
					</div>
					<div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[400px] scrollbar-custom">
						{pullRequests.length === 0 ? (
							<div className="p-4 text-center text-xs text-text-muted">
								No open pull requests.
							</div>
						) : (
							pullRequests.map((pr) => (
								<a
									key={pr.number}
									href={pr.url}
									target="_blank"
									rel="noopener noreferrer"
									className="flex flex-col p-3 rounded-md hover:bg-background transition-colors border border-transparent hover:border-border group"
								>
									<div className="flex justify-between items-start gap-2">
										<span className="font-bold text-sm text-text-main group-hover:text-primary transition-colors">
											{pr.title}
										</span>
										<ExternalLink size={12} className="text-text-muted mt-1" />
									</div>
									<div className="flex justify-between items-center mt-2">
										<span className="text-[10px] text-text-muted font-bold">
											#{pr.number} by {pr.author}
										</span>
										<span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-accent-purple/10 text-accent-purple font-bold uppercase">
											{pr.state}
										</span>
									</div>
								</a>
							))
						)}
					</div>
				</div>

				{/* Commits */}
				<div className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col">
					<div className="p-4 border-b border-border bg-surface-hover flex items-center gap-2">
						<GitCommit size={16} className="text-success" />
						<h3 className="font-bold text-text-main text-sm">Recent Commits</h3>
						<span className="ml-auto text-xs font-bold text-text-muted bg-background px-2 py-0.5 rounded-full">
							{commits.length}
						</span>
					</div>
					<div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[400px] scrollbar-custom">
						{commits.map((c) => (
							<a
								key={c.sha}
								href={c.url}
								target="_blank"
								rel="noopener noreferrer"
								className="flex flex-col p-3 rounded-md hover:bg-background transition-colors border border-transparent hover:border-border group"
							>
								<div className="flex justify-between items-start gap-2">
									<span className="font-bold text-sm text-text-main truncate group-hover:text-primary transition-colors">
										{c.message.split("\n")[0]}
									</span>
									<ExternalLink
										size={12}
										className="text-text-muted mt-1 flex-shrink-0"
									/>
								</div>
								<div className="flex justify-between items-center mt-2">
									<div className="flex items-center gap-1.5">
										<div className="w-4 h-4 rounded-full bg-text-muted flex items-center justify-center text-[8px] text-background font-bold">
											{c.author.charAt(0).toUpperCase()}
										</div>
										<span className="text-[10px] text-text-muted">
											{c.author}
										</span>
									</div>
									<span className="text-[10px] text-text-muted font-mono">
										{c.sha.substring(0, 7)}
									</span>
								</div>
							</a>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RepositoryTab;
