import React, { useState } from "react";
import BaseModal from "../molecules/BaseModal";
import Button from "../atoms/Button";
import { FileCode, Save, GitBranch } from "lucide-react";

interface CodeEditorModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (content: string, message: string) => void;
	fileName: string;
	initialContent: string;
	branch: string;
}

const CodeEditorModal: React.FC<CodeEditorModalProps> = ({
	isOpen,
	onClose,
	onSave,
	fileName,
	initialContent,
	branch,
}) => {
	const [content, setContent] = useState(initialContent);
	const [commitMessage, setCommitMessage] = useState(`Update ${fileName}`);
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async () => {
		setIsSaving(true);
		try {
			await onSave(content, commitMessage);
			onClose();
		} catch (err) {
			console.error("Failed to save file", err);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title={
				<div className="flex items-center gap-3">
					<div className="p-2 bg-primary/10 rounded-lg text-primary">
						<FileCode size={18} />
					</div>
					<div>
						<h3 className="text-sm font-bold text-text-main">{fileName}</h3>
						<div className="flex items-center gap-1 text-[10px] text-text-muted">
							<GitBranch size={10} /> {branch}
						</div>
					</div>
				</div>
			}
			size="xl"
			footer={
				<div className="flex gap-2">
					<Button variant="secondary" onClick={onClose}>
						Cancel
					</Button>
					<Button
						variant="primary"
						onClick={handleSave}
						isLoading={isSaving}
						leftIcon={<Save size={16} />}
					>
						Commit Changes
					</Button>
				</div>
			}
		>
			<div className="space-y-4 h-[500px] flex flex-col">
				<div className="flex-1 bg-slate-950 rounded-xl border border-border overflow-hidden relative group">
					<div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
						<span className="text-[10px] font-mono text-text-muted bg-slate-900/80 px-2 py-1 rounded">
							UTF-8
						</span>
					</div>
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className="w-full h-full bg-transparent text-emerald-400 font-mono text-sm p-6 outline-none resize-none scrollbar-custom"
						spellCheck={false}
					/>
				</div>

				<div className="space-y-2">
					<label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">
						Commit Message
					</label>
					<input
						type="text"
						value={commitMessage}
						onChange={(e) => setCommitMessage(e.target.value)}
						className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text-main outline-none focus:border-primary transition-all"
						placeholder="Describe your changes..."
					/>
				</div>
			</div>
		</BaseModal>
	);
};

export default CodeEditorModal;
