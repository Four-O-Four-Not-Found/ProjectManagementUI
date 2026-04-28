import React, { useState, useEffect, useCallback } from "react";
import { MoreVertical, UserPlus, Users, Share2, Plus, Loader2 } from "lucide-react";
import Badge from "../components/atoms/Badge";
import Avatar from "../components/atoms/Avatar";
import Button from "../components/atoms/Button";
import GlassCard from "../components/molecules/GlassCard";
import PageHeader from "../components/molecules/PageHeader";
import teamService, { type Team as TeamType } from "../services/teamService";
import TeamInviteModal from "../components/organisms/TeamInviteModal";
import TeamCreateModal from "../components/organisms/TeamCreateModal";
import { useToast } from "../hooks/useToast";
import { useAuthStore } from "../store/useAuthStore";

const DEFAULT_WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";

const Team: React.FC = () => {
	const [teams, setTeams] = useState<TeamType[]>([]);
	const [selectedTeam, setSelectedTeam] = useState<TeamType | null>(null);
	const [loading, setLoading] = useState(true);
	const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const { success, error } = useToast();
	const { user } = useAuthStore();

	const fetchTeams = useCallback(async () => {
		try {
			const data = await teamService.getWorkspaceTeams(DEFAULT_WORKSPACE_ID);
			setTeams(data);
			if (data.length > 0 && !selectedTeam) {
				const fullTeam = await teamService.getTeam(data[0].id);
				setSelectedTeam(fullTeam);
			}
		} catch {
			error("Sync Failed", "Could not synchronize team registry.");
		} finally {
			setLoading(false);
		}
	}, [selectedTeam, error]);

	useEffect(() => {
		fetchTeams();
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

	const handleCreateTeam = async (data: { name: string; description: string }) => {
		if (!user) return;
		try {
			const newTeam = await teamService.createTeam({
				...data,
				workspaceId: DEFAULT_WORKSPACE_ID,
				profileId: user.id,
			});
			setTeams([...teams, newTeam]);
			setSelectedTeam(newTeam);
			setIsCreateModalOpen(false);
			success("Team Initialized", `"${data.name}" is now part of the workspace.`);
		} catch {
			error("Creation Failed", "Could not initialize new team.");
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
				description="Manage workspace members and their permission levels."
				actions={
					<div className="flex gap-3">
						<Button
							variant="secondary"
							leftIcon={<Plus size={18} />}
							onClick={() => setIsCreateModalOpen(true)}
						>
							New Team
						</Button>
						<Button
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
					<h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Teams</h3>
					<div className="space-y-1">
						{teams.map((team) => (
							<button
								key={team.id}
								onClick={() => handleTeamSelect(team.id)}
								className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
									selectedTeam?.id === team.id
										? "bg-primary/10 border border-primary/20 text-primary"
										: "hover:bg-white/[0.03] text-slate-400"
								}`}
							>
								<Users size={18} />
								<span className="text-sm font-medium">{team.name}</span>
							</button>
						))}
						{teams.length === 0 && !loading && (
							<p className="text-xs text-slate-500 p-2 italic">No teams found.</p>
						)}
					</div>
				</GlassCard>

				{/* Members Table */}
				<GlassCard noPadding className="lg:col-span-3 overflow-hidden">
					{loading ? (
						<div className="flex flex-col items-center justify-center py-20 space-y-4">
							<Loader2 className="animate-spin text-primary" size={32} />
							<p className="text-sm text-slate-500 font-mono">Synchronizing member data...</p>
						</div>
					) : selectedTeam ? (
						<div className="overflow-x-auto scrollbar-custom">
							<div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.01]">
								<div>
									<h2 className="text-lg font-bold text-white">{selectedTeam.name}</h2>
									<p className="text-xs text-slate-500">{selectedTeam.description || "No description provided."}</p>
								</div>
								<div className="flex gap-2">
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
							<table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
								<thead>
									<tr className="border-b border-white/[0.05] bg-white/[0.02]">
										<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
											Member
										</th>
										<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
											Role
										</th>
										<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
											Status
										</th>
										<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest"></th>
									</tr>
								</thead>
								<tbody className="divide-y divide-white/[0.05]">
									{selectedTeam.members?.map((member) => (
										<tr
											key={member.profileId}
											className="hover:bg-white/[0.01] transition-colors group"
										>
											<td className="px-6 py-4">
												<div className="flex items-center gap-4">
													<Avatar name={member.name} size="md" />
													<div>
														<p className="text-sm font-bold text-white">
															{member.name}
														</p>
														<p className="text-xs text-slate-500">{member.email}</p>
													</div>
												</div>
											</td>
											<td className="px-6 py-4">
												<Badge
													variant={member.role === "Admin" ? "purple" : "primary"}
													size="sm"
												>
													{member.role}
												</Badge>
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center gap-2">
													<div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
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
									{(!selectedTeam.members || selectedTeam.members.length === 0) && (
										<tr>
											<td colSpan={4} className="px-6 py-10 text-center text-slate-500 italic">
												No members in this team yet. Invite someone!
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-50">
							<Users size={48} className="text-slate-600" />
							<p className="text-sm text-slate-500">Select a team to view its members.</p>
						</div>
					)}
				</GlassCard>
			</div>
		</div>
	);
};

export default Team;
