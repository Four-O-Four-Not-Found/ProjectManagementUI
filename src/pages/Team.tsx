import React, { useState, useEffect, useCallback, useRef } from "react";
import {
	MoreVertical,
	UserPlus,
	Users,
	Share2,
	Plus,
	Loader2,
} from "lucide-react";
import Avatar from "../components/atoms/Avatar";
import Button from "../components/atoms/Button";
import GlassCard from "../components/molecules/GlassCard";
import PageHeader from "../components/molecules/PageHeader";
import teamService, { type Team as TeamType } from "../services/teamService";
import TeamInviteModal from "../components/organisms/TeamInviteModal";
import TeamCreateModal from "../components/organisms/TeamCreateModal";
import { useToast } from "../hooks/useToast";
import { useAuthStore } from "../store/useAuthStore";

const Team: React.FC = () => {
	const [teams, setTeams] = useState<TeamType[]>([]);
	const [selectedTeam, setSelectedTeam] = useState<TeamType | null>(null);
	const [loading, setLoading] = useState(true);
	const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const { success, error } = useToast();
	const { user } = useAuthStore();
	const hasInitialized = useRef(false);

	const fetchTeams = useCallback(
		async (isInitial = false) => {
			if (!user) return;
			try {
				const data = await teamService.getMyTeams();
				console.log("[TeamPage] Fetched teams data:", data);
				setTeams(Array.isArray(data) ? data : []);

				if (isInitial && data.length > 0) {
					try {
						const fullTeam = await teamService.getTeam(data[0].id);
						setSelectedTeam(fullTeam);
					} catch {
						setSelectedTeam(data[0]);
					}
				}
			} catch {
				error("Sync Failed", "Could not synchronize team registry.");
			} finally {
				setLoading(false);
			}
		},
		[error, user],
	);

	useEffect(() => {
		if (!hasInitialized.current) {
			hasInitialized.current = true;
			fetchTeams(true);
		}
	}, [fetchTeams]);

	const handleTeamSelect = async (teamId: string) => {
		setLoading(true);
		try {
			const fullTeam = await teamService.getTeam(teamId);
			setSelectedTeam(fullTeam);
		} catch {
			error("Fetch Failed", "Could not retrieve team details.");
		} finally {
			setLoading(false);
		}
	};

	const handleCreateTeam = async (data: {
		name: string;
		description: string;
	}) => {
		if (!user) return;
		try {
			const newTeam = await teamService.createTeam({
				...data,
				userId: user.id,
			});
			setTeams([...teams, newTeam]);
			setSelectedTeam(newTeam);
			setIsCreateModalOpen(false);
			success(
				"Team Initialized",
				`"${data.name}" is now part of the project.`,
			);
		} catch {
			error("Creation Failed", "Could not initialize new team.");
		}
	};

	const handleSyncMembers = async () => {
		if (!selectedTeam) return;
		setLoading(true);
		try {
			await teamService.syncGithubMembers(selectedTeam.id);
			const updatedTeam = await teamService.getTeam(selectedTeam.id);
			setSelectedTeam(updatedTeam);
			success("Sync Complete", `Team members updated from GitHub.`);
		} catch {
			error("Sync Failed", "Could not synchronize with GitHub organization.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-8 animate-fade-in pb-10">
			<TeamInviteModal
				isOpen={isInviteModalOpen}
				onClose={() => setIsInviteModalOpen(false)}
				teamName={selectedTeam?.name || ""}
				inviteCode={selectedTeam?.inviteCode || ""}
			/>

			<TeamCreateModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onSave={handleCreateTeam}
			/>

			<PageHeader
				title="Team & Access"
				description="Manage project members and their permission levels."
				actions={
					<div className="flex gap-3">
						<Button
							variant="success"
							leftIcon={<Plus size={18} />}
							onClick={() => setIsCreateModalOpen(true)}
						>
							New Team
						</Button>
						<Button
							variant="secondary"
							leftIcon={<Share2 size={18} />}
							onClick={() => (window.location.href = "/github")}
						>
							Import GitHub Org
						</Button>
						<Button
							variant="success"
							leftIcon={<UserPlus size={18} />}
							onClick={() => setIsInviteModalOpen(true)}
							disabled={!selectedTeam}
						>
							Invite Member
						</Button>
					</div>
				}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Team Sidebar */}
				<GlassCard className="lg:col-span-1 p-4 space-y-4">
					<h3 className="text-xs font-bold text-text-muted uppercase tracking-widest px-2">
						Teams
					</h3>
					<div className="space-y-1">
						{teams.map((team) => (
							<button
								key={team.id}
								onClick={() => handleTeamSelect(team.id)}
								className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
									selectedTeam?.id === team.id
										? "bg-primary/10 border border-primary/20 text-primary"
										: "hover:bg-[var(--card-bg)] text-text-muted"
								}`}
							>
								<Users size={18} />
								<span className="text-sm font-medium">{team.name}</span>
							</button>
						))}
						{teams.length === 0 && !loading && (
							<div className="py-8 px-2">
								<p className="text-[10px] text-text-muted uppercase tracking-widest font-bold text-center mb-4">
									No teams active
								</p>
								<Button
									variant="secondary"
									size="xs"
									className="w-full text-[9px] uppercase tracking-tighter"
									onClick={() => setIsCreateModalOpen(true)}
								>
									Create Team
								</Button>
							</div>
						)}
					</div>
				</GlassCard>

				{/* Members Table */}
				<GlassCard noPadding className="lg:col-span-3 overflow-hidden">
					{loading ? (
						<div className="flex flex-col items-center justify-center py-20 space-y-4">
							<Loader2 className="animate-spin text-primary" size={32} />
							<p className="text-sm text-text-muted font-mono">
								Synchronizing member data...
							</p>
						</div>
					) : selectedTeam ? (
						<div className="overflow-x-auto scrollbar-custom">
							<div className="p-6 border-b border-[var(--card-border)] flex justify-between items-center bg-[var(--card-bg)]">
								<div>
									<h2 className="text-lg font-bold text-[var(--text-primary)]">
										{selectedTeam.name}
									</h2>
									<p className="text-xs text-text-muted">
										{selectedTeam.description || "No description provided."}
									</p>
								</div>
								<div className="flex gap-2">
									{selectedTeam.description?.includes("GitHub") && (
										<Button
											variant="ghost"
											size="sm"
											leftIcon={
												<Loader2
													size={16}
													className={loading ? "animate-spin" : ""}
												/>
											}
											onClick={() => handleSyncMembers()}
											disabled={loading}
										>
											Sync GitHub
										</Button>
									)}
									<Button
										variant="ghost"
										size="sm"
										leftIcon={<Share2 size={16} />}
										onClick={() => setIsInviteModalOpen(true)}
									>
										Share Team
									</Button>
								</div>
							</div>
							<table className="hidden md:table w-full text-left border-collapse min-w-[800px] md:min-w-0">
								<thead>
									<tr className="border-b border-[var(--card-border)] bg-[var(--card-bg)]">
										<th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">
											Member
										</th>
										<th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">
											Role
										</th>
										<th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">
											Status
										</th>
										<th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest"></th>
									</tr>
								</thead>
								<tbody className="divide-y divide-white/[0.05]">
									{selectedTeam.members?.map((member) => (
										<tr
											key={member.userId}
											className="hover:bg-[var(--card-bg)] transition-colors group"
										>
											<td className="px-6 py-4">
												<div className="flex items-center gap-4">
													<Avatar name={member.name} size="md" />
													<div>
														<p className="text-sm font-bold text-[var(--text-primary)]">
															{member.name}
														</p>
														<p className="text-xs text-text-muted">
															{member.email}
														</p>
													</div>
												</div>
											</td>
											<td className="px-6 py-4">
												<span
													className={`bg-[var(--card-bg)] border border-[var(--card-border)] rounded px-2 py-1 text-xs font-medium ${
														["Project Manager", "Product Owner"].includes(
															member.role,
														)
															? "text-purple-400"
															: [
																		"Tech Lead",
																		"Senior Developer",
																		"DevOps Engineer",
																		"Architect",
																		"Lead",
																  ].includes(member.role)
																? "text-primary"
																: [
																			"UI/UX Designer",
																			"QA Engineer",
																			"Designer",
																			"Member",
																	  ].includes(member.role)
																	? "text-primary"
																	: member.role === "Stakeholder"
																		? "text-text-muted"
																		: "text-primary"
													}`}
												>
													{member.role}
												</span>
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center gap-2">
													<div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
													<span className="text-xs text-slate-300">Active</span>
												</div>
											</td>
											<td className="px-6 py-4 text-right">
												<Button variant="ghost" size="sm">
													<MoreVertical size={18} />
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>

							<div className="md:hidden divide-y divide-white/[0.05]">
								{selectedTeam.members?.map((member) => (
									<div
										key={member.userId}
										className="p-4 space-y-3 active:bg-[var(--card-bg)]"
									>
										<div className="flex justify-between items-start">
											<div className="flex items-center gap-3">
												<Avatar name={member.name} size="md" />
												<div>
													<p className="text-sm font-bold text-[var(--text-primary)]">
														{member.name}
													</p>
													<p className="text-[10px] text-text-muted">
														{member.email}
													</p>
												</div>
											</div>
											<Button variant="ghost" size="sm" className="p-1 h-auto">
												<MoreVertical size={16} />
											</Button>
										</div>
										<div className="flex items-center justify-between">
											<span
												className={`bg-[var(--card-bg)] border border-[var(--card-border)] rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight ${
													["Project Manager", "Product Owner"].includes(
														member.role,
													)
														? "text-purple-400"
														: [
																	"Tech Lead",
																	"Senior Developer",
																	"DevOps Engineer",
																	"Architect",
																	"Lead",
															  ].includes(member.role)
															? "text-primary"
															: [
																		"UI/UX Designer",
																		"QA Engineer",
																		"Designer",
																		"Member",
																  ].includes(member.role)
																? "text-primary"
																: member.role === "Stakeholder"
																	? "text-text-muted"
																	: "text-primary"
												}`}
											>
												{member.role}
											</span>
											<div className="flex items-center gap-1.5">
												<div className="w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
												<span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">
													Active
												</span>
											</div>
										</div>
									</div>
								))}
							</div>

							{(!selectedTeam.members || selectedTeam.members.length === 0) && (
								<div className="px-6 py-10 text-center text-text-muted italic text-sm">
									No members in this team yet. Invite someone!
								</div>
							)}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-50">
							<Users size={48} className="text-text-muted" />
							<p className="text-sm text-text-muted">
								Select a team to view its members.
							</p>
						</div>
					)}
				</GlassCard>
			</div>
		</div>
	);
};

export default Team;
