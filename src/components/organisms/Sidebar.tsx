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
				"h-full bg-[#0f172a] border-r border-[#334155] flex flex-col transition-all duration-300 ease-in-out z-[100] relative !rounded-none",
				isCollapsed ? "w-16" : "w-64",
			)}
		>
			{/* Brand */}
			<div className="p-4 flex items-center gap-3 border-b border-[#334155] h-16">
				<div className="w-8 h-8 rounded bg-[#1e293b] flex items-center justify-center border border-[#334155]">
					<img src="/favicon.svg" alt="FlowState" className="w-5 h-5 object-contain" />
				</div>
				{!isCollapsed && (
					<span className="font-black text-lg text-[#f8fafc] tracking-tight uppercase">
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
			<div className="p-2 border-t border-[#334155]">
				<button
					onClick={onToggle}
					className="w-full py-2.5 rounded-lg hover:bg-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-[#38bdf8] transition-all group"
				>
					{isCollapsed ? (
						<ChevronRight size={18} />
					) : (
						<div className="flex items-center gap-3">
							<ChevronLeft size={18} />
							<span className="text-[10px] font-bold uppercase tracking-widest">Collapse Menu</span>
						</div>
					)}
				</button>
			</div>
		</aside>
	);
};

export default Sidebar;
