import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";

interface NavItemProps {
	to: string;
	icon: LucideIcon;
	label: string;
	isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
	to,
	icon: Icon,
	label,
	isCollapsed,
}) => {
	const location = useLocation();
	
	const isLinkActive = to === '/' 
		? location.pathname === '/' 
		: location.pathname.startsWith(to) || (to === '/board' && location.pathname.startsWith('/project/'));

	return (
		<NavLink
			to={to}
			className={
				clsx(
					"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative group",
					isLinkActive
						? "bg-[#1e293b] text-[#38bdf8] border-l-2 border-[#38bdf8] rounded-l-none font-bold"
						: "text-[#94a3b8] hover:bg-[#1e293b] hover:text-[#f8fafc]",
				)
			}
		>
			<Icon
				size={18}
				className="flex-shrink-0 transition-colors"
			/>
			{!isCollapsed && <span className="truncate">{label}</span>}
			
			{isCollapsed && (
				<div className="absolute left-full ml-4 px-2 py-1 bg-[#1e293b] border border-[#334155] rounded text-[10px] font-bold text-[#f8fafc] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
					{label}
				</div>
			)}
		</NavLink>
	);
};

export default NavItem;
