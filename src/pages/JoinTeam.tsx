import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import teamService, { type Team } from "../services/teamService";
import { useAuthStore } from "../store/useAuthStore";
import { useToast } from "../hooks/useToast";
import GlassCard from "../components/molecules/GlassCard";
import Button from "../components/atoms/Button";
import { UserPlus, Loader2, CheckCircle2 } from "lucide-react";

const JoinTeam: React.FC = () => {
	const { inviteCode } = useParams<{ inviteCode: string }>();
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const { success, error } = useToast();
	const [team, setTeam] = useState<Team | null>(null);
	const [loading, setLoading] = useState(true);
	const [joining, setJoining] = useState(false);

	useEffect(() => {
		const fetchTeam = async () => {
			if (!inviteCode) return;
			try {
				const data = await teamService.getTeamByInviteCode(inviteCode);
				setTeam(data);
			} catch {
				error("Invalid Invite", "This invite code is invalid or has expired.");
				navigate("/");
			} finally {
				setLoading(false);
			}
		};

		fetchTeam();
	}, [inviteCode, error, navigate]);

	const handleJoin = async () => {
		if (!team || !user || !inviteCode) return;
		setJoining(true);
		try {
			await teamService.joinTeam({
				inviteCode,
				userId: user.id,
			});
			success("Joined Team", `You are now a member of ${team.name}`);
			navigate("/team");
		} catch (err: unknown) {
			const message = (err as { response?: { data?: string } })?.response?.data || "Could not join the team.";
			error("Join Failed", message);
		} finally {
			setJoining(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<Loader2 className="animate-spin text-primary" size={48} />
			</div>
		);
	}

	if (!team) return null;

	return (
		<div className="flex items-center justify-center min-h-[70vh] animate-fade-in">
			<GlassCard className="max-w-md w-full p-8 text-center space-y-6">
				<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
					<UserPlus size={32} />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Join Team</h1>
					<p className="text-slate-400">
						You've been invited to join <span className="text-primary font-bold">{team.name}</span>
					</p>
					{team.description && (
						<p className="text-sm text-slate-500 mt-2 italic">"{team.description}"</p>
					)}
				</div>

				<div className="bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--card-border)] text-left">
					<h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Project Details</h3>
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded bg-accent-blue/20 flex items-center justify-center text-accent-blue">
							<CheckCircle2 size={16} />
						</div>
						<div>
							<p className="text-sm font-medium text-slate-200">Official Team</p>
							<p className="text-[10px] text-slate-500">Verified Project</p>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-3">
					<Button
						fullWidth
						size="lg"
						onClick={handleJoin}
						loading={joining}
						leftIcon={!joining && <UserPlus size={20} />}
					>
						Accept Invitation
					</Button>
					<Button
						fullWidth
						variant="ghost"
						size="lg"
						onClick={() => navigate("/")}
					>
						Decline
					</Button>
				</div>
			</GlassCard>
		</div>
	);
};

export default JoinTeam;
