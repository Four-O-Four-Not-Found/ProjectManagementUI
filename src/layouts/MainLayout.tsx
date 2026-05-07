import React, { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import Sidebar from "../components/organisms/Sidebar";
import CommandPalette from "../components/organisms/CommandPalette";
import NotificationCenter from "../components/organisms/NotificationCenter";
import ThemeToggle from "../components/atoms/ThemeToggle";
import AccountModal from "../components/organisms/AccountModal";
import Avatar from "../components/atoms/Avatar";
import {
	Search,
	Bell,
	Menu,
	Layout,
	User as UserIcon,
	Settings,
	LogOut,
	ChevronDown,
	Target,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useNotificationStore } from "../store/useNotificationStore";

const MainLayout: React.FC = () => {
	const location = useLocation();
	const { user, logout } = useAuthStore();
	const { unreadCount } = useNotificationStore();

	const isDashActive = location.pathname === "/";
	const isBoardActive =
		location.pathname.startsWith("/board") ||
		location.pathname.startsWith("/project/");
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
	const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

	const handleLogout = () => {
		setIsProfileDropdownOpen(false);
		logout();
	};

	return (
		<div className="flex h-screen bg-[#0f172a] text-[#f8fafc] overflow-hidden font-sans">
			<CommandPalette />
			<NotificationCenter
				isOpen={isNotificationsOpen}
				onClose={() => setIsNotificationsOpen(false)}
			/>
			<AccountModal
				isOpen={isAccountModalOpen}
				onClose={() => setIsAccountModalOpen(false)}
			/>

			{/* Mobile Backdrop */}
			{isMobileSidebarOpen && (
				<div
					className="fixed inset-0 bg-[#0f172a]/80 z-[90] lg:hidden"
					onClick={() => setIsMobileSidebarOpen(false)}
				/>
			)}

			{/* Sidebar - Desktop: Collapsible, Mobile: Drawer */}
			<div
				className={`
        fixed inset-y-0 left-0 z-[100] lg:relative lg:block transform transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
			>
				<Sidebar
					isCollapsed={isSidebarCollapsed}
					onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
				/>
			</div>

			{/* Main Content Area */}
			<main className="flex-1 flex flex-col min-w-0 h-full relative">
				{/* Header */}
				<header className="h-[64px] flex items-center justify-between px-6 border-b border-[#334155] bg-[#0f172a] z-20">
					<div className="flex items-center gap-4">
						<button
							onClick={() => setIsMobileSidebarOpen(true)}
							className="p-2 rounded-md lg:hidden text-[#94a3b8] hover:bg-[#1e293b] transition-colors"
						>
							<Menu size={20} />
						</button>

						<div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded bg-[#1e293b] border border-[#334155] text-[#94a3b8] text-[13px] hover:border-[#475569] transition-colors cursor-pointer w-[320px]">
							<Search size={14} className="ml-1" />
							<span className="font-medium">Search operations...</span>
							<div className="flex items-center gap-1 ml-auto mr-1 text-[10px] font-bold opacity-50 px-1.5 py-0.5 rounded border border-[#334155]">
								<span className="text-[12px]">/</span>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<ThemeToggle />

						<button
							onClick={() => setIsNotificationsOpen(true)}
							className="p-2 rounded-md hover:bg-[#1e293b] relative transition-colors group"
						>
							<Bell
								size={18}
								className="text-[#94a3b8] group-hover:text-[#f8fafc]"
							/>
							{unreadCount > 0 && (
								<span className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center bg-[#38bdf8] text-[#0f172a] text-[9px] font-black rounded-full border-2 border-[#0f172a]">
									{unreadCount > 9 ? "9+" : unreadCount}
								</span>
							)}
						</button>

						<div className="relative ml-2">
							<div
								className="flex items-center gap-2 p-1.5 pl-2 hover:bg-[#1e293b] rounded-lg cursor-pointer select-none border border-transparent hover:border-[#334155] transition-all"
								onClick={(e) => {
									e.stopPropagation();
									setIsProfileDropdownOpen(!isProfileDropdownOpen);
								}}
							>
								<Avatar
									src={user?.avatarUrl}
									name={user?.displayName}
									size="xs"
									className="border-[#334155] w-6 h-6"
								/>
								<ChevronDown
									size={12}
									className={`text-[#94a3b8] transition-transform duration-200 ${isProfileDropdownOpen ? "rotate-180" : ""}`}
								/>
							</div>

							{/* Profile Dropdown - Solid Matte */}
							{isProfileDropdownOpen && (
								<>
									<div
										className="fixed inset-0 z-10"
										onClick={() => setIsProfileDropdownOpen(false)}
									/>
									<div className="absolute right-0 mt-2 w-60 bg-[#1e293b] border border-[#334155] rounded-lg shadow-2xl z-20 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right pointer-events-auto">
										<div className="px-4 py-3 border-b border-[#334155] mb-1">
											<p className="text-[10px] text-[#94a3b8] uppercase tracking-widest font-black mb-1">
												Operator Profile
											</p>
											<p className="text-sm font-bold text-[#f8fafc] truncate">
												{user?.email}
											</p>
										</div>

										<button
											onClick={() => {
												setIsAccountModalOpen(true);
												setIsProfileDropdownOpen(false);
											}}
											className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#334155] transition-colors"
										>
											<UserIcon size={16} />
											<span className="font-medium">Command Center</span>
										</button>

										<button
											onClick={() => {
												setIsAccountModalOpen(true);
												setIsProfileDropdownOpen(false);
											}}
											className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#334155] transition-colors"
										>
											<Settings size={16} />
											<span className="font-medium">Preferences</span>
										</button>

										<div className="h-px bg-[#334155] my-1 mx-2" />

										<button
											onClick={handleLogout}
											className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#38bdf8] hover:bg-[#38bdf8]/10 transition-colors cursor-pointer font-bold"
										>
											<LogOut size={16} />
											<span>Terminate Session</span>
										</button>
									</div>
								</>
							)}
						</div>
					</div>
				</header>

				{/* Content Outlet */}
				<div className="flex-1 overflow-auto scrollbar-custom p-4 md:p-8 bg-[#0f172a] pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-8">
					<div className="max-w-[1400px] mx-auto">
						<Outlet />
					</div>
				</div>

				{/* Mobile Bottom Navigation - Solid Matte */}
				<nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[calc(4rem+env(safe-area-inset-bottom))] bg-[#1e293b] border-t border-[#334155] z-[80] flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
					<NavLink
						to="/"
						className={`flex flex-col items-center gap-1 p-2 transition-colors ${isDashActive ? "text-[#38bdf8]" : "text-[#94a3b8] hover:text-[#38bdf8]"}`}
					>
						<Layout size={20} />
						<span className="text-[10px] font-black uppercase tracking-widest">
							Home
						</span>
					</NavLink>
					<NavLink
						to="/board"
						className={`flex flex-col items-center gap-1 p-2 transition-colors ${isBoardActive ? "text-[#38bdf8]" : "text-[#94a3b8] hover:text-[#38bdf8]"}`}
					>
						<Target size={20} />
						<span className="text-[10px] font-black uppercase tracking-widest">
							Board
						</span>
					</NavLink>
					<button
						onClick={() => setIsMobileSidebarOpen(true)}
						className="flex flex-col items-center gap-1 p-2 text-[#94a3b8] hover:text-[#f8fafc] transition-colors"
					>
						<Menu size={20} />
						<span className="text-[10px] font-black uppercase tracking-widest">
							Menu
						</span>
					</button>
					<button
						onClick={() => setIsNotificationsOpen(true)}
						className={`flex flex-col items-center gap-1 p-2 transition-colors relative ${isNotificationsOpen ? "text-[#38bdf8]" : "text-[#94a3b8] hover:text-[#38bdf8]"}`}
					>
						<Bell size={20} />
						{unreadCount > 0 && (
							<span className="absolute top-2 right-3 w-2 h-2 bg-[#38bdf8] rounded-full border border-[#1e293b]"></span>
						)}
						<span className="text-[10px] font-black uppercase tracking-widest">
							Alerts
						</span>
					</button>
				</nav>
			</main>
		</div>
	);
};

export default MainLayout;
