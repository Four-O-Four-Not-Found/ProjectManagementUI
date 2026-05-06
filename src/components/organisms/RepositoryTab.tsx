import React, { useEffect, useState } from "react";
import {
	GitBranch,
	GitCommit,
	GitPullRequest,
	ExternalLink,
	Loader2,
	Folder,
	FileCode,
	Layers,
	Trash2,
	Plus,
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
import CodeEditorModal from "./CodeEditorModal";
import Button from "../atoms/Button";
import { useToast } from "../../hooks/useToast";

interface RepositoryTabProps {
	gitHubRepo: string;
}

const TreeNode: React.FC<{
	item: { path: string; type: string; size?: number };
	depth: number;
	onClick: (path: string) => void;
}> = ({ item, depth, onClick }) => {
	const parts = (item.path || "").split("/");
	const fileName = parts[parts.length - 1] || "";
	const isFolder = item.type === "tree";

	return (
		<div className="flex flex-col">
			<div
				className="flex items-center gap-2 py-1 px-2 rounded hover:bg-primary/10 transition-all cursor-pointer group select-none"
				onClick={() => !isFolder && onClick(item.path)}
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
	const { success, error: toastError } = useToast();
	const [branches, setBranches] = useState<GitHubBranch[]>([]);
	const [commits, setCommits] = useState<GitHubCommit[]>([]);
	const [pullRequests, setPullRequests] = useState<GitHubPullRequest[]>([]);
	const [repoDetails, setRepoDetails] = useState<GitHubRepoDetails | null>(
		null,
	);
	const [loading, setLoading] = useState(true);
	const [selectedCommitSha, setSelectedCommitSha] = useState<string | null>(
		null,
	);
	const [editingFile, setEditingFile] = useState<{
		path: string;
		content: string;
	} | null>(null);

	const parts = (gitHubRepo || "").split("/");
	const owner = parts[0] || "";
	const repo = parts[1] || "";

	useEffect(() => {
		let isMounted = true;
		const loadRepoData = async () => {
			if (!gitHubRepo || parts.length !== 2) return;
			
			setLoading(true);
			try {
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
			} catch {
				if (isMounted) toastError("Load Error", "Failed to load repository data.");
			} finally {
				if (isMounted) setLoading(false);
			}
		};

		loadRepoData();
		return () => { isMounted = false; };
	}, [gitHubRepo, owner, repo, parts.length, toastError]);

	const handleDeleteBranch = async (branchName: string) => {
		if (
			window.confirm(`Are you sure you want to delete branch "${branchName}"?`)
		) {
			try {
				await githubService.deleteBranch(owner, repo, branchName);
				success("Branch Deleted", `Branch ${branchName} has been removed.`);
				setBranches(branches.filter((b) => b.name !== branchName));
			} catch {
				toastError("Action Failed", "Could not delete branch.");
			}
		}
	};

	const handleDeletePR = async (prNumber: number) => {
		if (
			window.confirm(`Are you sure you want to close/delete PR #${prNumber}?`)
		) {
			try {
				await githubService.deletePullRequest(owner, repo, prNumber);
				success("PR Closed", `Pull Request #${prNumber} has been removed.`);
				setPullRequests(pullRequests.filter((pr) => pr.number !== prNumber));
			} catch {
				toastError("Action Failed", "Could not delete PR.");
			}
		}
	};

	const handleFileClick = (path: string) => {
		setEditingFile({
			path,
			content: `// Source for ${path}\n// Direct editing enabled via ProjectManager Source Bridge\n\nfunction main() {\n  console.log("Ready to deploy.");\n}`,
		});
	};

	const handleSaveFile = async (content: string, message: string) => {
		if (editingFile) {
			try {
				await githubService.updateFile(
					owner,
					repo,
					editingFile.path,
					content,
					message,
					branches[0]?.name || "main",
				);
				success("File Committed", `${editingFile.path} has been updated.`);
				setEditingFile(null);
				
				// Re-fetch data
				const [b, c, prs, details] = await Promise.all([
					githubService.getBranches(owner, repo),
					githubService.getCommits(owner, repo),
					githubService.getPullRequests(owner, repo),
					githubService.getRepoDetails(owner, repo),
				]);
				setBranches(b);
				setCommits(c);
				setPullRequests(prs);
				setRepoDetails(details);
			} catch {
				toastError("Commit Failed", "Could not write to repository.");
			}
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64 text-text-muted">
				<Loader2 className="animate-spin mr-2" size={24} /> Loading repository
				data...
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-fade-in pb-10">
			<CommitDetailModal
				isOpen={!!selectedCommitSha}
				onClose={() => setSelectedCommitSha(null)}
				owner={owner}
				repo={repo}
				sha={selectedCommitSha}
			/>

			{editingFile && (
				<CodeEditorModal
					isOpen={!!editingFile}
					onClose={() => setEditingFile(null)}
					onSave={handleSaveFile}
					fileName={editingFile.path && typeof editingFile.path === 'string' ? editingFile.path.split("/").pop() || "" : "Untitled"}
					initialContent={editingFile.content}
					branch={branches[0]?.name || "main"}
				/>
			)}

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

				<div className="flex items-center gap-4">
					<Button
						variant="secondary"
						size="sm"
						leftIcon={<Plus size={16} />}
						onClick={() =>
							success("New Repo Init", "Initializing target repository...")
						}
					>
						Initialize New Repo
					</Button>
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
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Architecture Diagram (File Tree) */}
				<div className="md:col-span-2 bg-surface border border-border rounded-xl overflow-hidden flex flex-col shadow-lg shadow-black/20">
					<div className="px-5 py-4 border-b border-border bg-[var(--accent-primary)]/10 flex justify-between items-center">
						<div className="flex items-center gap-2">
							<Layers size={16} className="text-primary" />
							<h3 className="font-extrabold text-text-main text-xs uppercase tracking-wider">
								Infrastructure Map
							</h3>
						</div>
						<div className="flex items-center gap-3">
							<span className="text-[10px] text-text-muted italic">
								Click to edit code
							</span>
							<span className="text-[10px] font-bold text-text-muted bg-background px-2 py-0.5 rounded border border-border">
								{repoDetails?.tree.length || 0} Objects Detected
							</span>
						</div>
					</div>
					<div className="p-4 bg-background/20 max-h-[450px] overflow-y-auto scrollbar-custom font-mono">
						<div className="space-y-0.5">
							{repoDetails ? (
								repoDetails.tree.map((item, idx) => (
									<TreeNode
										key={`${item.path}-${idx}`}
										item={item}
										depth={(item.path.match(/\//g) || []).length}
										onClick={handleFileClick}
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
						<div className="p-3 border-b border-border bg-[var(--accent-primary)]/10 flex items-center gap-2">
							<GitBranch size={14} className="text-primary" />
							<h3 className="font-bold text-text-main text-xs">Branches</h3>
						</div>
						<div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-custom">
							{branches.map((b) => (
								<div
									key={b.name}
									className="group flex items-center justify-between p-2 rounded-md hover:bg-background transition-colors border border-transparent hover:border-border"
								>
									<div className="flex flex-col min-w-0">
										<span className="font-bold text-[11px] text-text-main truncate">
											{b.name}
										</span>
										<span className="text-[9px] text-text-muted font-mono">
											{b.commitSha.substring(0, 7)}
										</span>
									</div>
									<button
										onClick={() => handleDeleteBranch(b.name)}
										className="p-1.5 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-all"
									>
										<Trash2 size={12} />
									</button>
								</div>
							))}
						</div>
					</div>

					{/* Pull Requests */}
					<div className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col h-[215px]">
						<div className="p-3 border-b border-border bg-[var(--accent-primary)]/10 flex items-center gap-2">
							<GitPullRequest size={14} className="text-accent-purple" />
							<h3 className="font-bold text-text-main text-xs">PRs</h3>
						</div>
						<div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-custom">
							{pullRequests.length === 0 ? (
								<div className="p-4 text-center text-[10px] text-text-muted italic">
									No open PRs.
								</div>
							) : (
								pullRequests.map((pr) => (
									<div
										key={pr.number}
										className="group flex items-center justify-between p-2 rounded-md hover:bg-background transition-colors border border-transparent hover:border-border"
									>
										<div className="flex flex-col min-w-0 flex-1">
											<span className="font-bold text-[11px] text-text-main group-hover:text-primary truncate">
												{pr.title}
											</span>
											<span className="text-[8px] text-text-muted">
												#{pr.number} by {pr.author}
											</span>
										</div>
										<button
											onClick={() => handleDeletePR(pr.number)}
											className="p-1.5 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-all"
										>
											<Trash2 size={12} />
										</button>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Commits Section */}
			<div className="bg-surface border border-border rounded-xl overflow-hidden shadow-lg shadow-black/20">
				<div className="px-5 py-3 border-b border-border bg-[var(--accent-primary)]/10 flex items-center gap-2">
					<GitCommit size={14} className="text-success" />
					<h3 className="font-extrabold text-text-main text-[10px] uppercase tracking-wider">
						Recent Deployment Stream
					</h3>
				</div>
				<div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto scrollbar-custom">
					{commits.map((c) => (
						<button
							key={c.sha}
							onClick={() => setSelectedCommitSha(c.sha)}
							className="flex flex-col p-3 rounded-xl hover:bg-background transition-all border border-transparent hover:border-border group text-left"
						>
							<span className="font-bold text-[11px] text-text-main group-hover:text-primary transition-colors line-clamp-1">
								{c.message}
							</span>
							<span className="text-[9px] text-text-muted font-mono mt-1">
								{c.sha.substring(0, 7)} by {c.author}
							</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default RepositoryTab;
