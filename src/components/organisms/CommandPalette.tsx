import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, ArrowRight, Zap, Target, Users } from "lucide-react";

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
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setIsOpen(false)}
						className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
					/>
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: -20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: -20 }}
						className="fixed top-[10%] md:top-[20%] left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl glass-panel rounded-2xl overflow-hidden z-[201] border-white/[0.1] shadow-2xl"
					>
						<div className="p-4 border-b border-white/[0.05] flex items-center gap-3">
							<Search size={20} className="text-slate-500" />
							<input
								autoFocus
								type="text"
								placeholder="Search tasks, projects, or team members..."
								className="bg-transparent flex-1 outline-none text-slate-200 text-lg"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<div className="flex items-center gap-1 px-2 py-1 bg-white/[0.05] rounded text-[10px] text-slate-500 font-bold uppercase">
								ESC
							</div>
						</div>

						<div className="max-h-[400px] overflow-y-auto p-2 scrollbar-custom">
							{results.length > 0 ? (
								results.map((item) => (
									<div
										key={item.id}
										className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.05] cursor-pointer group transition-all"
									>
										<div className="flex items-center gap-4">
											<div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
												<item.icon size={18} />
											</div>
											<div>
												<p className="text-sm font-semibold text-white">
													{item.title}
												</p>
												<p className="text-[10px] text-slate-500 uppercase tracking-widest">
													{item.type}
												</p>
											</div>
										</div>
										<ArrowRight
											size={16}
											className="text-slate-600 group-hover:text-primary transition-all group-hover:translate-x-1 opacity-0 group-hover:opacity-100"
										/>
									</div>
								))
							) : (
								<div className="p-12 text-center">
									<p className="text-slate-500">
										No results found for "{search}"
									</p>
								</div>
							)}
						</div>

						<div className="p-3 border-t border-white/[0.05] bg-white/[0.01] flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest">
							<div className="flex gap-4">
								<span className="flex items-center gap-1">
									<ArrowRight size={10} /> Navigate
								</span>
								<span className="flex items-center gap-1">
									<Command size={10} /> Select
								</span>
							</div>
							<span>FlowState Search</span>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default CommandPalette;
