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
				"h-full bg-surface border-r border-border flex flex-col transition-all duration-300 ease-in-out z-[100] relative",
				isCollapsed ? "w-16" : "w-64",
			)}
		>
			{/* Brand */}
			<div className="p-4 flex items-center gap-3 border-b border-border h-16">
				<div className="w-8 h-8 rounded-md bg-text-main flex items-center justify-center">
					<Target size={20} className="text-background" />
				</div>
				{!isCollapsed && (
					<span className="font-bold text-lg text-text-main tracking-tight">
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
			<div className="p-2 border-t border-border">
				<button
					onClick={onToggle}
					className="w-full py-2 rounded-md hover:bg-background flex items-center justify-center text-text-muted hover:text-text-main transition-colors group"
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
