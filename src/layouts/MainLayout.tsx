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
		<div className="flex h-screen bg-background text-text-main overflow-hidden font-sans">
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
					className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[90] lg:hidden"
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
				<header className="h-[64px] flex items-center justify-between px-4 border-b border-[var(--border)] bg-[var(--surface)] z-20">
					<div className="flex items-center gap-3">
						<button
							onClick={() => setIsMobileSidebarOpen(true)}
							className="p-2 rounded-md lg:hidden text-[var(--text-muted)] hover:bg-[var(--surface-hover)] transition-colors"
						>
							<Menu size={20} />
						</button>

						<div className="hidden md:flex items-center gap-2 px-2 py-1.5 rounded-github bg-[var(--background)] border border-[var(--border)] text-[var(--text-muted)] text-[13px] hover:border-[var(--text-muted)] transition-colors cursor-pointer w-[300px]">
							<Search size={14} className="ml-1" />
							<span>Search or jump to...</span>
							<div className="flex items-center gap-1 ml-auto mr-1 text-[10px] font-mono opacity-50 px-1.5 py-0.5 rounded border border-[var(--border)]">
								<span className="text-[12px]">/</span>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<ThemeToggle />

						<button
							onClick={() => setIsNotificationsOpen(true)}
							className="p-2 rounded-md hover:bg-[var(--surface-hover)] relative transition-colors group"
						>
							<Bell
								size={18}
								className="text-[var(--text-muted)] group-hover:text-[var(--text-main)]"
							/>
							{unreadCount > 0 && (
								<span className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center bg-[var(--color-primary)] text-[var(--text-primary)] text-[9px] font-bold rounded-full border-2 border-[var(--surface)]">
									{unreadCount > 9 ? "9+" : unreadCount}
								</span>
							)}
						</button>

						<div className="relative ml-2">
							<div
								className="flex items-center gap-2 p-1 pl-2 hover:bg-[var(--surface-hover)] rounded-github cursor-pointer select-none border border-transparent hover:border-[var(--border)] transition-all"
								onClick={(e) => {
									e.stopPropagation();
									setIsProfileDropdownOpen(!isProfileDropdownOpen);
								}}
							>
								<Avatar
									src={user?.avatarUrl}
									name={user?.displayName}
									size="xs"
									className="border-[var(--border)] w-6 h-6"
								/>
								<ChevronDown
									size={12}
									className={`text-[var(--text-muted)] transition-transform duration-200 ${isProfileDropdownOpen ? "rotate-180" : ""}`}
								/>
							</div>

							{/* Profile Dropdown */}
							{isProfileDropdownOpen && (
								<>
									<div
										className="fixed inset-0 z-10"
										onClick={() => setIsProfileDropdownOpen(false)}
									/>
									<div className="absolute right-0 mt-2 w-56 bg-surface/90 backdrop-blur-xl border border-primary/30 rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right pointer-events-auto">
										<div className="px-4 py-3 border-b border-primary/30/50 mb-1">
											<p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1">
												Signed in as
											</p>
											<p className="text-sm font-semibold text-text-main truncate">
												{user?.email}
											</p>
										</div>

										<button
											onClick={() => {
												setIsAccountModalOpen(true);
												setIsProfileDropdownOpen(false);
											}}
											className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:text-text-main hover:bg-[var(--card-bg)] transition-colors"
										>
											<UserIcon size={16} />
											<span>Your Profile</span>
										</button>

										<button
											onClick={() => {
												setIsAccountModalOpen(true);
												setIsProfileDropdownOpen(false);
											}}
											className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:text-text-main hover:bg-[var(--card-bg)] transition-colors"
										>
											<Settings size={16} />
											<span>Settings</span>
										</button>

										<div className="h-px bg-border/50 my-1 mx-2" />

										<button
											onClick={handleLogout}
											className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-primary/10 transition-colors cursor-pointer"
										>
											<LogOut size={16} />
											<span>Sign out</span>
										</button>
									</div>
								</>
							)}
						</div>
					</div>
				</header>

				{/* Content Outlet */}
				<div className="flex-1 overflow-auto scrollbar-custom p-4 md:p-6 bg-background pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-6">
					<div className="max-w-[1400px] mx-auto">
						<Outlet />
					</div>
				</div>

				{/* Mobile Bottom Navigation */}
				<nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[calc(4rem+env(safe-area-inset-bottom))] bg-surface/80 backdrop-blur-xl border-t border-primary/30 z-[80] flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
					<NavLink
						to="/"
						className={`flex flex-col items-center gap-1 p-2 transition-colors ${isDashActive ? "text-primary" : "text-text-muted hover:text-primary"}`}
					>
						<Layout size={20} />
						<span className="text-[10px] font-bold uppercase tracking-widest">
							Home
						</span>
					</NavLink>
					<NavLink
						to="/board"
						className={`flex flex-col items-center gap-1 p-2 transition-colors ${isBoardActive ? "text-primary" : "text-text-muted hover:text-primary"}`}
					>
						<Target size={20} />
						<span className="text-[10px] font-bold uppercase tracking-widest">
							Board
						</span>
					</NavLink>
					<button
						onClick={() => setIsMobileSidebarOpen(true)}
						className="flex flex-col items-center gap-1 p-2 text-text-muted hover:text-text-main transition-colors"
					>
						<Menu size={20} />
						<span className="text-[10px] font-bold uppercase tracking-widest">
							Menu
						</span>
					</button>
					<button
						onClick={() => setIsNotificationsOpen(true)}
						className={`flex flex-col items-center gap-1 p-2 transition-colors relative ${isNotificationsOpen ? "text-primary" : "text-text-muted hover:text-primary"}`}
					>
						<Bell size={20} />
						{unreadCount > 0 && (
							<span className="absolute top-2 right-3 w-2 h-2 bg-primary rounded-full border border-surface"></span>
						)}
						<span className="text-[10px] font-bold uppercase tracking-widest">
							Alerts
						</span>
					</button>
				</nav>
			</main>
		</div>
	);
};

export default MainLayout;
