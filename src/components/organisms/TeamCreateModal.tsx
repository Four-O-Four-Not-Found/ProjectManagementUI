import React, { useState } from "react";
import BaseModal from "../molecules/BaseModal";
import Button from "../atoms/Button";

interface TeamCreateModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: { name: string; description: string }) => void;
}

const TeamCreateModal: React.FC<TeamCreateModalProps> = ({
	isOpen,
	onClose,
	onSave,
}) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await onSave({ name, description });
			setName("");
			setDescription("");
		} finally {
			setLoading(false);
		}
	};

	return (
		<BaseModal isOpen={isOpen} onClose={onClose} title="Initialize New Team">
			<form onSubmit={handleSubmit} className="space-y-6 py-4">
				<div className="space-y-2">
					<label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
						Team Name
					</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary/50 transition-colors"
						placeholder="e.g. Frontend Squad"
						required
					/>
				</div>

				<div className="space-y-2">
					<label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
						Description
					</label>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary/50 transition-colors min-h-[100px]"
						placeholder="Briefly describe the team's mission..."
					/>
				</div>

				<div className="flex gap-3 pt-4">
					<Button
						type="button"
						variant="ghost"
						fullWidth
						onClick={onClose}
						disabled={loading}
					>
						Cancel
					</Button>
					<Button type="submit" variant="success" fullWidth loading={loading}>
						Create Team
					</Button>
				</div>
			</form>
		</BaseModal>
	);
};

export default TeamCreateModal;
