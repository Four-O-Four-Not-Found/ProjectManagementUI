import React, { useEffect, useState } from "react";
import {
	GitBranch,
	GitCommit,
	GitPullRequest,
	ExternalLink,
	Loader2,
	Folder,
	FileCode,
	Cpu,
	Layers,
} from "lucide-react";
import { githubService } from "../../services/githubService";
import type {
	GitHubBranch,
	GitHubCommit,
	GitHubPullRequest,
	GitHubRepoDetails,
} from "../../services/githubService";
import { twMerge } from "tailwind-merge";
import CommitDetailModal from "./CommitDetailModal";

interface RepositoryTabProps {
	gitHubRepo: string;
}

const TreeNode: React.FC<{
	item: { path: string; type: string; size?: number };
	depth: number;
}> = ({ item, depth }) => {
	const parts = item.path.split("/");
	const fileName = parts[parts.length - 1];
	const isFolder = item.type === "tree";

	return (
		<div className="flex flex-col">
			<div
				className="flex items-center gap-2 py-1 px-2 rounded hover:bg-primary/10 transition-all cursor-default group select-none"
				style={{ paddingLeft: `${depth * 16 + 8}px` }}
			>
				<span className="text-text-muted/30 w-4 flex justify-center">
					{depth > 0 ? "│" : ""}
				</span>
				{isFolder ? (
					<Folder size={14} className="text-primary fill-primary/20 shrink-0" />
				) : (
					<FileCode size={14} className="text-text-muted shrink-0" />
				)}
				<span
					className={twMerge(
						"text-[12px] truncate",
						isFolder ? "text-text-main font-bold" : "text-text-muted",
					)}
				>
					{fileName}
				</span>
				{item.size && (
					<span className="ml-auto text-[9px] text-text-muted/40 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
						{(item.size / 1024).toFixed(1)} KB
					</span>
				)}
			</div>
		</div>
	);
};

const RepositoryTab: React.FC<RepositoryTabProps> = ({ gitHubRepo }) => {
	const [branches, setBranches] = useState<GitHubBranch[]>([]);
	const [commits, setCommits] = useState<GitHubCommit[]>([]);
	const [pullRequests, setPullRequests] = useState<GitHubPullRequest[]>([]);
	const [repoDetails, setRepoDetails] = useState<GitHubRepoDetails | null>(
		null,
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [selectedCommitSha, setSelectedCommitSha] = useState<string | null>(
		null,
	);

	useEffect(() => {
		let isMounted = true;
		const loadRepoData = async () => {
			setLoading(true);
			try {
				const parts = gitHubRepo.split("/");
				if (parts.length === 2) {
					const [owner, repo] = parts;
					const [b, c, prs, details] = await Promise.all([
						githubService.getBranches(owner, repo),
						githubService.getCommits(owner, repo),
						githubService.getPullRequests(owner, repo),
						githubService.getRepoDetails(owner, repo),
					]);
					if (isMounted) {
						setBranches(b);
						setCommits(c);
						setPullRequests(prs);
						setRepoDetails(details);
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

	const parts = gitHubRepo.split("/");
	const owner = parts[0];
	const repo = parts[1];

	return (
		<div className="space-y-6 animate-fade-in pb-10">
			<CommitDetailModal
				isOpen={!!selectedCommitSha}
				onClose={() => setSelectedCommitSha(null)}
				owner={owner}
				repo={repo}
				sha={selectedCommitSha}
			/>

			{/* Repo Header & Stats */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface border border-border p-4 rounded-lg shadow-sm">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
						<Layers size={24} />
					</div>
					<div>
						<h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none mb-1">
							Source Integration
						</h3>
						<div className="flex items-center gap-2">
							<span className="text-lg font-black text-text-main tracking-tight">
								{gitHubRepo}
							</span>
							<a
								href={`https://github.com/${gitHubRepo}`}
								target="_blank"
								rel="noopener noreferrer"
								className="p-1.5 rounded-lg hover:bg-background text-text-muted hover:text-primary transition-all active:scale-95"
							>
								<ExternalLink size={16} />
							</a>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-4 md:gap-8 bg-background/40 p-2 md:p-3 rounded-xl border border-border/50">
					<div className="flex flex-col items-center">
						<span className="text-text-muted text-[9px] font-bold uppercase tracking-tighter mb-0.5">
							Branches
						</span>
						<span className="text-text-main font-black text-base leading-none">
							{branches.length}
						</span>
					</div>
					<div className="w-px h-6 bg-border/50"></div>
					<div className="flex flex-col items-center">
						<span className="text-text-muted text-[9px] font-bold uppercase tracking-tighter mb-0.5">
							Open PRs
						</span>
						<span className="text-accent-purple font-black text-base leading-none">
							{pullRequests.length}
						</span>
					</div>
					<div className="w-px h-6 bg-border/50"></div>
					<div className="flex flex-col items-center">
						<span className="text-text-muted text-[9px] font-bold uppercase tracking-tighter mb-0.5">
							Commits
						</span>
						<span className="text-success font-black text-base leading-none">
							{commits.length}
						</span>
					</div>
				</div>
			</div>

			{/* Tech Stack Summary */}
			<div className="bg-surface border border-border rounded-xl overflow-hidden shadow-lg shadow-black/20">
				<div className="px-5 py-3 border-b border-border bg-surface-hover/30 flex items-center gap-2">
					<Cpu size={14} className="text-success" />
					<h3 className="font-extrabold text-text-main text-[10px] uppercase tracking-wider">
						Stack Profile & Repository DNA
					</h3>
				</div>
				<div className="p-4 flex flex-col md:flex-row items-center gap-6 md:gap-12">
					<div className="flex flex-col min-w-[200px]">
						<span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block mb-1 opacity-60">
							Architecture
						</span>
						<p className="text-base font-black text-text-main leading-tight tracking-tight">
							{repoDetails?.techStackSummary || "Undetermined"}
						</p>
					</div>

					<div className="hidden md:block w-px h-8 bg-border" />

					<div className="flex flex-col flex-1">
						<span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block mb-2 opacity-60">
							Language DNA
						</span>
						<div className="flex flex-wrap gap-2">
							{repoDetails?.languages.map((lang) => (
								<div
									key={lang}
									className="flex items-center gap-2 px-2 py-1 bg-background border border-border rounded-md group hover:border-primary/50 transition-all cursor-default"
								>
									<div className="w-1.5 h-1.5 rounded-full bg-primary" />
									<span className="text-[10px] font-black text-text-main group-hover:text-primary transition-colors">
										{lang}
									</span>
								</div>
							))}
						</div>
					</div>

					<div className="hidden md:block w-px h-8 bg-border" />

					<div className="flex-1 italic text-[10px] text-text-muted bg-primary/5 p-2 rounded-lg border border-primary/10">
						"This repository follows a
						<span className="text-primary font-bold not-italic px-1">
							{repoDetails?.techStackSummary.includes(",")
								? "Polyglot"
								: "Monolith"}
						</span>
						pattern with {repoDetails?.languages.length} distinct signatures."
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Architecture Diagram (File Tree) */}
				<div className="md:col-span-2 bg-surface border border-border rounded-xl overflow-hidden flex flex-col shadow-lg shadow-black/20">
					<div className="px-5 py-4 border-b border-border bg-surface-hover/50 flex justify-between items-center">
						<div className="flex items-center gap-2">
							<Layers size={16} className="text-primary" />
							<h3 className="font-extrabold text-text-main text-xs uppercase tracking-wider">
								Infrastructure Map
							</h3>
						</div>
						<span className="text-[10px] font-bold text-text-muted bg-background px-2 py-0.5 rounded border border-border">
							{repoDetails?.tree.length || 0} Objects Detected
						</span>
					</div>
					<div className="p-4 bg-background/20 max-h-[450px] overflow-y-auto scrollbar-custom font-mono">
						<div className="space-y-0.5">
							{repoDetails ? (
								repoDetails.tree.map((item, idx) => (
									<TreeNode
										key={`${item.path}-${idx}`}
										item={item}
										depth={(item.path.match(/\//g) || []).length}
									/>
								))
							) : (
								<div className="py-20 text-center text-text-muted text-xs italic">
									No structure data available.
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="space-y-6">
					{/* Branches */}
					<div className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col h-[215px]">
						<div className="p-3 border-b border-border bg-surface-hover flex items-center gap-2">
							<GitBranch size={14} className="text-primary" />
							<h3 className="font-bold text-text-main text-xs">Branches</h3>
							<span className="ml-auto text-[10px] font-bold text-text-muted bg-background px-2 py-0.5 rounded-full">
								{branches.length}
							</span>
						</div>
						<div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-custom">
							{branches.map((b) => (
								<div
									key={b.name}
									className="flex flex-col p-2 rounded-md hover:bg-background transition-colors border border-transparent hover:border-border"
								>
									<span className="font-bold text-[11px] text-text-main">
										{b.name}
									</span>
									<span className="text-[9px] text-text-muted font-mono">
										{b.commitSha.substring(0, 7)}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Pull Requests */}
					<div className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col h-[215px]">
						<div className="p-3 border-b border-border bg-surface-hover flex items-center gap-2">
							<GitPullRequest size={14} className="text-accent-purple" />
							<h3 className="font-bold text-text-main text-xs">PRs</h3>
							<span className="ml-auto text-[10px] font-bold text-text-muted bg-background px-2 py-0.5 rounded-full">
								{pullRequests.length}
							</span>
						</div>
						<div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-custom">
							{pullRequests.length === 0 ? (
								<div className="p-4 text-center text-[10px] text-text-muted italic">
									No open PRs.
								</div>
							) : (
								pullRequests.map((pr) => (
									<a
										key={pr.number}
										href={pr.url}
										target="_blank"
										rel="noopener noreferrer"
										className="flex flex-col p-2 rounded-md hover:bg-background transition-colors border border-transparent hover:border-border group"
									>
										<div className="flex justify-between items-start gap-2">
											<span className="font-bold text-[11px] text-text-main group-hover:text-primary truncate">
												{pr.title}
											</span>
											<ExternalLink size={10} className="text-text-muted mt-0.5" />
										</div>
										<div className="flex justify-between items-center mt-1">
											<span className="text-[8px] text-text-muted">
												#{pr.number} by {pr.author}
											</span>
										</div>
									</a>
								))
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6">
				{/* Commits (Wide view at bottom) */}
				<div className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col shadow-lg shadow-black/20">
					<div className="p-4 border-b border-border bg-surface-hover flex items-center gap-2">
						<GitCommit size={16} className="text-success" />
						<h3 className="font-bold text-text-main text-sm">Recent Commits</h3>
						<span className="ml-auto text-xs font-bold text-text-muted bg-background px-2 py-0.5 rounded-full">
							{commits.length}
						</span>
					</div>
					<div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto scrollbar-custom">
						{commits.map((c) => (
							<div
								key={c.sha}
								onClick={() => setSelectedCommitSha(c.sha)}
								className="flex flex-col p-3 rounded-xl hover:bg-background transition-all border border-transparent hover:border-border group cursor-pointer"
							>
								<div className="flex justify-between items-start gap-2">
									<span className="font-bold text-xs text-text-main group-hover:text-primary transition-colors line-clamp-1">
										{c.message.split("\n")[0]}
									</span>
									<ExternalLink
										size={10}
										className="text-text-muted flex-shrink-0"
									/>
								</div>
								<div className="flex justify-between items-center mt-2">
									<div className="flex items-center gap-1.5">
										<div className="w-4 h-4 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[8px] text-primary font-bold">
											{c.author.charAt(0).toUpperCase()}
										</div>
										<span className="text-[10px] text-text-muted">{c.author}</span>
									</div>
									<span className="text-[10px] text-text-muted font-mono font-bold">
										{c.sha.substring(0, 7)}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RepositoryTab;
