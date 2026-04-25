import { MoreVertical, UserPlus } from "lucide-react";
import Badge from "../components/atoms/Badge";
import Avatar from "../components/atoms/Avatar";
import Button from "../components/atoms/Button";
import GlassCard from "../components/molecules/GlassCard";
import PageHeader from "../components/molecules/PageHeader";

const teamMembers = [
	{
		id: "1",
		name: "Alex Rivera",
		role: "Admin",
		email: "alex@FlowState.com",
		tasks: 12,
		performance: 95,
	},
	{
		id: "2",
		name: "Elena Vance",
		role: "Project Manager",
		email: "elena@FlowState.com",
		tasks: 8,
		performance: 88,
	},
	{
		id: "3",
		name: "John Doe",
		role: "Developer",
		email: "john@FlowState.com",
		tasks: 15,
		performance: 72,
	},
	{
		id: "4",
		name: "Sarah Jenkins",
		role: "Developer",
		email: "sarah@FlowState.com",
		tasks: 6,
		performance: 91,
	},
];

const Team: React.FC = () => {
	return (
		<div className="space-y-8 animate-fade-in pb-10">
			<PageHeader
				title="Team & Access"
				description="Manage workspace members and their permission levels."
				actions={
					<Button
						className="w-full md:w-auto"
						leftIcon={<UserPlus size={18} />}
					>
						Invite Member
					</Button>
				}
			/>

			<GlassCard noPadding className="overflow-hidden">
				<div className="overflow-x-auto scrollbar-custom">
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
									Capacity Heatmap
								</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
									Performance
								</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest"></th>
							</tr>
						</thead>
						<tbody className="divide-y divide-white/[0.05]">
							{teamMembers.map((member) => (
								<tr
									key={member.id}
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
										<div className="flex items-center gap-2">
											<Badge
												variant={member.role === "Admin" ? "purple" : "primary"}
												size="sm"
											>
												{member.role}
											</Badge>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-1">
											{Array.from({ length: 10 }).map((_, i) => (
												<div
													key={i}
													className={`w-2 h-6 rounded-sm ${
														i < member.tasks / 2
															? "bg-primary shadow-[0_0_8px_rgba(56,189,248,0.3)]"
															: "bg-white/[0.05]"
													}`}
												/>
											))}
											<span className="ml-2 text-xs text-slate-400 font-mono">
												{member.tasks} tasks
											</span>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<div className="flex-1 h-1.5 w-24 bg-white/[0.05] rounded-full overflow-hidden">
												<div
													className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full"
													style={{ width: `${member.performance}%` }}
												></div>
											</div>
											<span className="text-xs font-bold text-slate-300">
												{member.performance}%
											</span>
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
				</div>
			</GlassCard>
		</div>
	);
};

export default Team;
