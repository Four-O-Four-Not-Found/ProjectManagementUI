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
					"flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all relative group",
					isLinkActive
						? "bg-background text-text-main border-l-2 border-primary rounded-l-none"
						: "text-text-muted hover:bg-surface-hover hover:text-text-main",
				)
			}
		>
			<Icon
				size={18}
				className="flex-shrink-0 transition-colors"
			/>
			{!isCollapsed && <span className="truncate">{label}</span>}
			
			{isCollapsed && (
				<div className="absolute left-full ml-4 px-2 py-1 bg-surface border border-border rounded text-[10px] font-bold text-text-main whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
					{label}
				</div>
			)}
		</NavLink>
	);
};

export default NavItem;
