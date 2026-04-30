import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/organisms/Sidebar";
import CommandPalette from "../components/organisms/CommandPalette";
import NotificationCenter from "../components/organisms/NotificationCenter";
import ThemeToggle from "../components/atoms/ThemeToggle";
import AccountModal from "../components/organisms/AccountModal";
import {
	Search,
	Bell,
	Command,
	Menu,
	User as UserIcon,
	Settings,
	LogOut,
	ChevronDown,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useNotificationStore } from "../store/useNotificationStore";

const MainLayout: React.FC = () => {
	const { user, logout } = useAuthStore();
	const { unreadCount } = useNotificationStore();
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
				<header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-border bg-surface z-20">
					<div className="flex items-center gap-4">
						<button
							onClick={() => setIsMobileSidebarOpen(true)}
							className="p-2 rounded-md lg:hidden text-text-muted hover:bg-background transition-colors"
						>
							<Menu size={20} />
						</button>

						<div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-background border border-border text-text-muted text-sm hover:border-text-muted transition-colors cursor-pointer group">
							<Search size={16} />
							<span>Search or jump to...</span>
							<div className="hidden xl:flex items-center gap-1 ml-4 text-[10px] font-mono opacity-50">
								<Command size={10} />
								<span>K</span>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<ThemeToggle />

						<button
							onClick={() => setIsNotificationsOpen(true)}
							className="p-2 rounded-md hover:bg-background relative transition-colors group"
						>
							<Bell
								size={20}
								className="text-text-muted group-hover:text-text-main"
							/>
							{unreadCount > 0 && (
								<span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 flex items-center justify-center px-1 bg-danger text-white text-[9px] font-bold rounded-full border-2 border-surface">
									{unreadCount > 9 ? "9+" : unreadCount}
								</span>
							)}
						</button>

						<div className="h-8 w-px bg-border"></div>

						<div className="relative">
							<div
								className="flex items-center gap-3 pl-2 group cursor-pointer select-none"
								onClick={(e) => {
									e.stopPropagation();
									setIsProfileDropdownOpen(!isProfileDropdownOpen);
								}}
							>
								<div className="text-right hidden sm:block">
									<p className="text-sm font-semibold text-text-main leading-tight">
										{user?.displayName || "Guest"}
									</p>
									<p className="text-[10px] text-text-muted uppercase tracking-wider">
										{user?.role || "Visitor"}
									</p>
								</div>
								<div className="w-8 h-8 rounded-full border border-border overflow-hidden group-hover:border-primary transition-colors flex-shrink-0">
									<img
										src={
											user?.avatarUrl ||
											`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName || "Guest"}`
										}
										alt="Avatar"
										className="w-full h-full object-cover"
									/>
								</div>
								<ChevronDown
									size={14}
									className={`text-text-muted transition-transform duration-200 ${isProfileDropdownOpen ? "rotate-180" : ""}`}
								/>
							</div>

							{/* Profile Dropdown */}
							{isProfileDropdownOpen && (
								<>
									<div
										className="fixed inset-0 z-10"
										onClick={() => setIsProfileDropdownOpen(false)}
									/>
									<div className="absolute right-0 mt-2 w-56 bg-surface/90 backdrop-blur-xl border border-border rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right pointer-events-auto">
										<div className="px-4 py-3 border-b border-border/50 mb-1">
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
											className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:text-text-main hover:bg-white/5 transition-colors"
										>
											<UserIcon size={16} />
											<span>Your Profile</span>
										</button>

										<button
											onClick={() => {
												setIsAccountModalOpen(true);
												setIsProfileDropdownOpen(false);
											}}
											className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:text-text-main hover:bg-white/5 transition-colors"
										>
											<Settings size={16} />
											<span>Settings</span>
										</button>

										<div className="h-px bg-border/50 my-1 mx-2" />

										<button
											onClick={handleLogout}
											className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors cursor-pointer"
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
				<div className="flex-1 overflow-auto scrollbar-custom p-4 md:p-6 bg-background">
					<div className="max-w-[1400px] mx-auto">
						<Outlet />
					</div>
				</div>
			</main>
		</div>
	);
};

export default MainLayout;
