import React from "react";
import {
	LayoutDashboard,
	Kanban,
	List,
	Users,
	Settings,
	Target,
	ChevronLeft,
	ChevronRight,
	GitBranch,
} from "lucide-react";
import { clsx } from "clsx";
import NavItem from "../atoms/NavItem";

interface SidebarProps {
	isCollapsed: boolean;
	onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
	const menuItems = [
		{ to: "/", icon: LayoutDashboard, label: "Dashboard" },
		{ to: "/board", icon: Kanban, label: "Board" },
		{ to: "/list", icon: List, label: "List View" },
		{ to: "/github", icon: GitBranch, label: "GitHub Admin" },
		{ to: "/team", icon: Users, label: "Team & Access" },
		{ to: "/settings", icon: Settings, label: "Settings" },
	];

	return (
		<aside
			className={clsx(
				"h-full glass-panel border-r border-white/[0.1] flex flex-col transition-all duration-500 ease-out z-[100] relative",
				isCollapsed ? "w-20" : "w-72",
			)}
		>
			{/* Brand */}
			<div className="p-6 flex items-center gap-4 border-b border-white/[0.05]">
				<div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.4)]">
					<Target size={24} className="text-white" />
				</div>
				{!isCollapsed && (
					<span className="font-bold text-xl text-main water-gradient-text tracking-tight">
						FlowState
					</span>
				)}
			</div>

			{/* Navigation */}
			<nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto scrollbar-custom">
				{menuItems.map((item) => (
					<NavItem
						key={item.to}
						to={item.to}
						icon={item.icon}
						label={item.label}
						isCollapsed={isCollapsed}
					/>
				))}
			</nav>

			{/* Footer Actions */}
			<div className="p-4 border-t border-white/[0.05]">
				<button
					onClick={onToggle}
					className="w-full py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-muted hover:text-main hover:bg-white/[0.05] transition-all group"
				>
					{isCollapsed ? (
						<ChevronRight size={20} />
					) : (
						<div className="flex items-center gap-3">
							<ChevronLeft size={20} />
							<span className="text-xs font-bold uppercase tracking-widest">
								Collapse
							</span>
						</div>
					)}
				</button>
			</div>
		</aside>
	);
};

export default Sidebar;
