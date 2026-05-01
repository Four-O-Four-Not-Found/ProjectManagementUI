import React, { useState } from "react";
import {
	User,
	Mail,
	Lock,
	Bell,
	Shield,
	Smartphone,
	Save,
	LogOut,
	Palette,
} from "lucide-react";
import PageHeader from "../components/molecules/PageHeader";
import GlassCard from "../components/molecules/GlassCard";
import Button from "../components/atoms/Button";
import Avatar from "../components/atoms/Avatar";
import { useAuthStore } from "../store/useAuthStore";
import { useToast } from "../hooks/useToast";

const Settings: React.FC = () => {
	const { user, logout } = useAuthStore();
	const { success } = useToast();
	const [displayName, setDisplayName] = useState(user?.displayName || "Member");
	const [email, setEmail] = useState(user?.email || "member@example.com");

	const handleSave = () => {
		success("Profile Updated", "Your changes have been saved successfully.");
	};

	return (
		<div className="space-y-8 animate-fade-in pb-20 max-w-4xl mx-auto">
			<PageHeader
				title="Global Settings"
				description="Manage your account preferences and security settings."
			/>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Sidebar-like Navigation in Page */}
				<div className="space-y-2">
					{[
						{ icon: User, label: "Profile", active: true },
						{ icon: Bell, label: "Notifications", active: false },
						{ icon: Lock, label: "Security", active: false },
						{ icon: Palette, label: "Appearance", active: false },
						{ icon: Shield, label: "Privacy", active: false },
					].map((item) => (
						<button
							key={item.label}
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${item.active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-text-muted hover:bg-surface border border-transparent hover:border-border"}`}
						>
							<item.icon size={18} />
							{item.label}
						</button>
					))}
					<button
						onClick={logout}
						className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold text-danger hover:bg-danger/10 mt-8"
					>
						<LogOut size={18} />
						Logout Session
					</button>
				</div>

				<div className="md:col-span-2 space-y-8">
					{/* Profile Section */}
					<section className="space-y-4">
						<h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-1">
							Public Profile
						</h3>
						<GlassCard className="p-8">
							<div className="flex flex-col md:flex-row items-center gap-8 mb-8">
								<div className="relative group">
									<Avatar
										name={displayName}
										size="xl"
										className="ring-4 ring-primary/20"
									/>
									<div className="absolute inset-0 bg-black/40 rounded-[24px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
										<Smartphone size={20} className="text-white" />
									</div>
								</div>
								<div className="text-center md:text-left">
									<h4 className="text-xl font-black text-text-main">
										{displayName}
									</h4>
									<p className="text-xs text-text-muted mb-2">{email}</p>
									<Button variant="secondary" size="xs">
										Change Avatar
									</Button>
								</div>
							</div>

							<div className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
											Full Name
										</label>
										<div className="relative">
											<User
												className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
												size={16}
											/>
											<input
												type="text"
												value={displayName}
												onChange={(e) => setDisplayName(e.target.value)}
												className="w-full bg-background border border-border rounded-lg pl-10 p-3 text-sm text-text-main focus:outline-none focus:border-primary transition-colors"
											/>
										</div>
									</div>
									<div className="space-y-2">
										<label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
											Email Address
										</label>
										<div className="relative">
											<Mail
												className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
												size={16}
											/>
											<input
												type="email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												className="w-full bg-background border border-border rounded-lg pl-10 p-3 text-sm text-text-main focus:outline-none focus:border-primary transition-colors"
											/>
										</div>
									</div>
								</div>
								<div className="flex justify-end pt-4 border-t border-border/50">
									<Button
										variant="primary"
										size="sm"
										leftIcon={<Save size={16} />}
										onClick={handleSave}
									>
										Save Profile
									</Button>
								</div>
							</div>
						</GlassCard>
					</section>

					{/* Preferences */}
					<section className="space-y-4">
						<h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-1">
							System Preferences
						</h3>
						<GlassCard className="p-6">
							<div className="space-y-4">
								<div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
									<div className="flex items-center gap-3">
										<div className="p-2 bg-success/10 rounded-lg text-success">
											<Bell size={18} />
										</div>
										<div>
											<p className="text-xs font-bold text-text-main">
												Push Notifications
											</p>
											<p className="text-[10px] text-text-muted">
												Real-time browser alerts
											</p>
										</div>
									</div>
									<div className="w-10 h-5 bg-success rounded-full relative">
										<div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
									</div>
								</div>
							</div>
						</GlassCard>
					</section>
				</div>
			</div>
		</div>
	);
};

export default Settings;
