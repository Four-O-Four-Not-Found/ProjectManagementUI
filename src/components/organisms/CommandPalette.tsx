import React, { useEffect, useState } from "react";
import { ArrowRight, Zap, Target, Users, Search, Command } from "lucide-react";
import BaseModal from "../molecules/BaseModal";

const CommandPalette: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState("");

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setIsOpen(true);
			}
			if (e.key === "Escape") {
				setIsOpen(false);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const results = [
		{ id: "1", title: "WEB-42: Implement SignalR", type: "Task", icon: Zap },
		{ id: "2", title: "Frontend Overhaul", type: "Project", icon: Target },
		{ id: "3", title: "Sarah Jenkins", type: "Member", icon: Users },
	].filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			size="lg"
			title={
				<div className="flex items-center gap-3 w-full">
					<Search size={18} className="text-text-muted" />
					<input
						autoFocus
						type="text"
						placeholder="Search tasks, projects, or team members..."
						className="bg-transparent flex-1 outline-none text-text-main text-sm"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<div className="hidden md:flex items-center gap-1 px-1.5 py-0.5 bg-surface border border-border rounded text-[9px] text-text-muted font-bold uppercase">
						ESC
					</div>
				</div>
			}
			footer={
				<div className="w-full flex items-center justify-between text-[9px] text-text-muted font-bold uppercase tracking-widest px-1">
					<div className="flex gap-4">
						<span className="flex items-center gap-1">
							<ArrowRight size={10} /> Navigate
						</span>
						<span className="flex items-center gap-1">
							<Command size={10} /> Select
						</span>
					</div>
					<span className="opacity-50">FlowState Search</span>
				</div>
			}
		>
			<div className="max-h-[350px] overflow-y-auto scrollbar-custom -mx-2">
				{results.length > 0 ? (
					results.map((item) => (
						<div
							key={item.id}
							className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--accent-primary)]/10 cursor-pointer group transition-all border border-transparent hover:border-border"
						>
							<div className="flex items-center gap-4">
								<div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
									<item.icon size={18} />
								</div>
								<div>
									<p className="text-sm font-semibold text-text-main">
										{item.title}
									</p>
									<p className="text-[10px] text-text-muted uppercase tracking-widest">
										{item.type}
									</p>
								</div>
							</div>
							<ArrowRight
								size={16}
								className="text-text-muted group-hover:text-primary transition-all group-hover:translate-x-1 opacity-0 group-hover:opacity-100"
							/>
						</div>
					))
				) : (
					<div className="py-12 text-center">
						<p className="text-text-muted text-sm italic">
							No results found for "{search}"
						</p>
					</div>
				)}
			</div>
		</BaseModal>
	);
};

export default CommandPalette;
