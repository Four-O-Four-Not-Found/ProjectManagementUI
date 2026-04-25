import React from 'react';
import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, isCollapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        twMerge(
          "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group",
          isActive 
            ? "bg-primary text-slate-900 shadow-[0_0_20px_rgba(56,189,248,0.3)]" 
            : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
        )
      }
    >
      <Icon size={22} className="flex-shrink-0" />
      {!isCollapsed && <span className="font-bold text-sm tracking-wide">{label}</span>}
      {isCollapsed && (
        <div className="absolute left-full ml-4 px-3 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100]">
          {label}
        </div>
      )}
    </NavLink>
  );
};

export default NavItem;
