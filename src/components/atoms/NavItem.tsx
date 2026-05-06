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
						? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-l-[3px] border-[var(--accent-primary)] rounded-l-none font-bold shadow-[inset_4px_0_10px_rgba(0,132,255,0.05)]"
						: "text-[var(--text-secondary)] hover:bg-[var(--accent-primary)]/5 hover:text-[var(--text-primary)]",
				)
			}
		>
			<Icon
				size={18}
				className="flex-shrink-0 transition-colors"
			/>
			{!isCollapsed && <span className="truncate">{label}</span>}
			
			{isCollapsed && (
				<div className="absolute left-full ml-4 px-2 py-1 bg-surface border border-primary/30 rounded text-[10px] font-bold text-text-main whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
					{label}
				</div>
			)}
		</NavLink>
	);
};

export default NavItem;
