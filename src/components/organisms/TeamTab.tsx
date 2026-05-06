import React from "react";
import { motion } from "framer-motion";
import { Users as UsersIcon, Target } from "lucide-react";
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";
import type { Team } from "../../services/teamService";

interface TeamTabProps {
	projectTeam: Team | null;
	hasTeamAssigned: boolean;
	onRoleChange: (userId: string, newRole: string) => void;
	onGoToSettings: () => void;
}

const TeamTab: React.FC<TeamTabProps> = ({
	projectTeam,
	hasTeamAssigned,
	onRoleChange,
	onGoToSettings,
}) => {
	return (
		<motion.div
			key="team"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="h-full bg-surface/30 border border-border rounded-md p-8 overflow-y-auto"
		>
			<div className="max-w-4xl mx-auto space-y-6">
				<div>
					<h2 className="text-xl font-bold text-text-main flex items-center gap-2">
						<UsersIcon className="text-primary" size={24} />
						Project Team
					</h2>
					<p className="text-sm text-text-muted mt-1">
						Members of the team assigned to this project.
					</p>
				</div>

				{!hasTeamAssigned ? (
					<div className="p-8 border border-dashed border-border rounded-lg flex flex-col items-center justify-center text-center bg-surface/10">
						<div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted mb-4">
							<UsersIcon size={24} />
						</div>
						<h3 className="text-text-main font-bold">No Team Assigned</h3>
						<p className="text-sm text-text-muted max-w-sm mt-2">
							There is no team assigned to this project yet. Go to Settings to assign a project team.
						</p>
						<Button variant="primary" className="mt-4" onClick={onGoToSettings}>
							Go to Settings
						</Button>
					</div>
				) : projectTeam ? (
					<div className="space-y-4">
						<div className="p-4 border border-border rounded-lg bg-surface/50 flex justify-between items-center">
							<div>
								<h3 className="font-bold text-text-main">{projectTeam.name}</h3>
								<p className="text-xs text-text-muted mt-1">
									{projectTeam.description || "No description provided."}
								</p>
							</div>
							<Button
								variant="secondary"
								onClick={() => (window.location.href = "/team")}
							>
								Manage Team
							</Button>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{projectTeam.members?.map((member) => (
								<div
									key={member.userId}
									className="p-4 border border-border rounded-lg bg-surface flex items-center gap-4 hover:border-text-muted transition-colors"
								>
									<Avatar name={member.name} size="md" />
									<div>
										<p className="text-sm font-bold text-text-main">
											{member.name}
										</p>
										<select
											value={member.role}
											onChange={(e) =>
												onRoleChange(member.userId, e.target.value)
											}
											className={`bg-[var(--accent-primary)]/10 border border-border rounded px-2 py-1 text-xs font-medium focus:outline-none focus:border-primary transition-colors cursor-pointer mt-1 ${
												["Project Manager", "Product Owner"].includes(
													member.role,
												)
													? "text-purple-400"
													: [
															"Tech Lead",
															"Senior Developer",
															"DevOps Engineer",
													  ].includes(member.role)
														? "text-emerald-400"
														: [
																"UI/UX Designer",
																"QA Engineer",
														  ].includes(member.role)
															? "text-amber-400"
															: member.role === "Stakeholder"
																? "text-slate-400"
																: "text-primary"
											}`}
										>
											<optgroup
												label="Management"
												className="bg-slate-900 text-slate-500"
											>
												<option
													value="Project Manager"
													className="text-purple-400"
												>
													Project Manager
												</option>
												<option
													value="Product Owner"
													className="text-purple-400"
												>
													Product Owner
												</option>
											</optgroup>
											<optgroup
												label="Engineering"
												className="bg-slate-900 text-slate-500"
											>
												<option value="Tech Lead" className="text-emerald-400">
													Tech Lead
												</option>
												<option
													value="Senior Developer"
													className="text-emerald-400"
												>
													Senior Developer
												</option>
												<option value="Developer" className="text-primary">
													Developer
												</option>
												<option
													value="Junior Developer"
													className="text-primary"
												>
													Junior Developer
												</option>
												<option
													value="DevOps Engineer"
													className="text-emerald-400"
												>
													DevOps Engineer
												</option>
											</optgroup>
											<optgroup
												label="Design & Quality"
												className="bg-slate-900 text-slate-500"
											>
												<option
													value="UI/UX Designer"
													className="text-amber-400"
												>
													UI/UX Designer
												</option>
												<option value="QA Engineer" className="text-amber-400">
													QA Engineer
												</option>
											</optgroup>
											<optgroup
												label="Other"
												className="bg-slate-900 text-slate-500"
											>
												<option value="Stakeholder" className="text-slate-400">
													Stakeholder
												</option>
												<option value="Member" className="text-primary">
													Member
												</option>
											</optgroup>
										</select>
									</div>
								</div>
							))}
							{(!projectTeam.members || projectTeam.members.length === 0) && (
								<div className="col-span-full p-8 border border-dashed border-border rounded-lg text-center text-text-muted">
									No members found in this team.
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="flex items-center justify-center p-12">
						<div className="animate-spin text-primary">
							<Target size={24} />
						</div>
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default TeamTab;
