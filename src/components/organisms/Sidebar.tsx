import React from "react";
import {
	LayoutDashboard,
	Kanban,
	List,
	Users,
	Settings,
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
		{ to: "/", icon: LayoutDashboard, label: "Home" },
		{ to: "/board", icon: Kanban, label: "Projects" },
		{ to: "/list", icon: List, label: "List View" },
		{ to: "/github", icon: GitBranch, label: "GitHub Admin" },
		{ to: "/team", icon: Users, label: "Team & Access" },
		{ to: "/settings", icon: Settings, label: "Settings" },
	];

	return (
		<aside
			className={clsx(
				"h-full glass-panel border-r border-primary/30 flex flex-col transition-all duration-300 ease-in-out z-[100] relative !rounded-none",
				isCollapsed ? "w-16" : "w-64",
			)}
		>
			{/* Brand */}
			<div className="p-4 flex items-center gap-3 border-b border-primary/30 h-16">
				<div className="w-8 h-8 rounded-md flex items-center justify-center overflow-hidden">
					<img src="/favicon.svg" alt="FlowState" className="w-6 h-6 object-contain" />
				</div>
				{!isCollapsed && (
					<span className="font-bold text-lg neon-text tracking-tight uppercase">
						FlowState
					</span>
				)}
			</div>

			{/* Navigation */}
			<nav
				className={clsx(
					"flex-1 px-2 py-4 space-y-1 scrollbar-custom",
					isCollapsed ? "overflow-hidden" : "overflow-y-auto",
				)}
			>
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
			<div className="p-2 border-t border-primary/30">
				<button
					onClick={onToggle}
					className="w-full py-2.5 rounded-lg hover:bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-all group"
				>
					{isCollapsed ? (
						<ChevronRight size={18} />
					) : (
						<div className="flex items-center gap-3">
							<ChevronLeft size={18} />
							<span className="text-xs font-semibold">Collapse Sidebar</span>
						</div>
					)}
				</button>
			</div>
		</aside>
	);
};

export default Sidebar;
