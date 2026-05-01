import React, { useEffect, useState } from "react";
import { FileText, Plus, Minus, GitCommit, ExternalLink } from "lucide-react";
import { githubService } from "../../services/githubService";
import type { GitHubCommitDetail } from "../../services/githubService";
import BaseModal from "../molecules/BaseModal";

interface CommitDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	owner: string;
	repo: string;
	sha: string | null;
}

const CommitDetailModal: React.FC<CommitDetailModalProps> = ({
	isOpen,
	onClose,
	owner,
	repo,
	sha,
}) => {
	const [details, setDetails] = useState<GitHubCommitDetail | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let isMounted = true;

		if (isOpen && sha) {
			const fetchDetails = async () => {
				setLoading(true);
				try {
					const data = await githubService.getCommitDetails(owner, repo, sha);
					if (isMounted) {
						setDetails(data);
					}
				} catch (error) {
					console.error("Failed to fetch commit details", error);
				} finally {
					if (isMounted) {
						setLoading(false);
					}
				}
			};
			fetchDetails();
		}

		return () => {
			isMounted = false;
			// Reset details when the effect re-runs or unmounts
			// This is safer than a separate useEffect for clearing
			setDetails(null);
		};
	}, [isOpen, sha, owner, repo]);

	return (
		<BaseModal isOpen={isOpen} onClose={onClose} title="Commit Inspection">
			{loading ? (
				<div className="flex flex-col items-center justify-center py-20 gap-4">
					<div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
					<span className="text-xs font-bold text-text-muted uppercase tracking-widest">
						Analyzing Diff...
					</span>
				</div>
			) : details ? (
				<div className="space-y-6">
					{/* Commit Header */}
					<div className="p-4 bg-background border border-border rounded-xl">
						<div className="flex justify-between items-start mb-4">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
									<GitCommit size={20} />
								</div>
								<div>
									<h4 className="text-sm font-black text-text-main leading-tight">
										{details.message}
									</h4>
									<p className="text-[10px] text-text-muted mt-1 font-mono">
										{details.sha}
									</p>
								</div>
							</div>
							<a
								href={details.url}
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 rounded-lg hover:bg-surface text-text-muted hover:text-primary transition-colors"
							>
								<ExternalLink size={18} />
							</a>
						</div>

						<div className="flex items-center gap-6 pt-4 border-t border-border/50">
							<div className="flex flex-col">
								<span className="text-[8px] font-bold text-text-muted uppercase tracking-tighter">
									Author
								</span>
								<span className="text-xs font-bold text-text-main">
									{details.author}
								</span>
							</div>
							<div className="flex flex-col">
								<span className="text-[8px] font-bold text-text-muted uppercase tracking-tighter">
									Changes
								</span>
								<div className="flex items-center gap-2 mt-0.5">
									<span className="text-[10px] font-black text-success flex items-center gap-1">
										<Plus size={10} /> {details.additions}
									</span>
									<span className="text-[10px] font-black text-danger flex items-center gap-1">
										<Minus size={10} /> {details.deletions}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Files List */}
					<div className="space-y-3">
						<h5 className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">
							Modified Files ({details.files.length})
						</h5>
						<div className="max-h-[350px] overflow-y-auto scrollbar-custom space-y-2 pr-2">
							{details.files.map((file) => (
								<div
									key={file.filename}
									className="group bg-surface/50 border border-border rounded-xl p-3 hover:border-primary/50 transition-all"
								>
									<div className="flex items-center justify-between gap-4">
										<div className="flex items-center gap-2 min-w-0">
											<FileText
												size={14}
												className="text-text-muted shrink-0"
											/>
											<span className="text-xs font-bold text-text-main truncate">
												{file.filename}
											</span>
										</div>
										<div className="flex items-center gap-2 shrink-0">
											<span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-background border border-border text-text-muted uppercase">
												{file.status}
											</span>
											<div className="flex items-center gap-1">
												<span className="text-[9px] font-bold text-success">
													+{file.additions}
												</span>
												<span className="text-[9px] font-bold text-danger">
													-{file.deletions}
												</span>
											</div>
										</div>
									</div>
									{file.patch && (
										<div className="mt-3 p-2 bg-background/50 rounded-lg border border-border/50 overflow-hidden">
											<pre className="text-[9px] font-mono text-text-muted leading-relaxed truncate opacity-70">
												{file.patch.split("\n").slice(0, 3).join("\n")}
												{file.patch.split("\n").length > 3 && "\n..."}
											</pre>
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			) : (
				<div className="py-20 text-center text-text-muted italic text-xs">
					No details available for this commit.
				</div>
			)}
		</BaseModal>
	);
};

export default CommitDetailModal;
