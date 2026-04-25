import React from "react";
import {
	Users,
	CheckCircle2,
	Clock,
	FileText,
	Plus,
	GitBranch,
} from "lucide-react";
import PageHeader from "../components/molecules/PageHeader";
import ProgressBar from "../components/atoms/ProgressBar";
import ActivityItem from "../components/molecules/ActivityItem";
import Button from "../components/atoms/Button";
import StatCard from "../components/molecules/StatCard";
import GlassCard from "../components/molecules/GlassCard";
import type { Activity } from "../types";

const Dashboard: React.FC = () => {
	const recentActivities: Activity[] = [
		{
			id: "1",
			userId: "1",
			userName: "Sarah",
			userAvatar: "Sarah",
			action: "moved",
			target: "WEB-42",
			timestamp: "2m ago",
			type: "status_change",
		},
		{
			id: "2",
			userId: "2",
			userName: "John",
			userAvatar: "John",
			action: "commented on",
			target: "WEB-45",
			timestamp: "15m ago",
			type: "comment",
		},
		{
			id: "3",
			userId: "1",
			userName: "Sarah",
			userAvatar: "Sarah",
			action: "completed",
			target: "WEB-39",
			timestamp: "2h ago",
			type: "status_change",
		},
	];

	return (
		<div className="space-y-8 animate-fade-in pb-10">
			<PageHeader
				title="Project Overview"
				description={
					<>
						Welcome back! Here's what's happening with{" "}
						<span className="text-primary font-medium">FlowState</span> today.
					</>
				}
				actions={
					<>
						<Button
							variant="secondary"
							className="flex-1 md:flex-none"
							leftIcon={<FileText size={16} />}
						>
							Report
						</Button>
						<Button
							className="flex-1 md:flex-none"
							leftIcon={<Plus size={16} />}
						>
							New Task
						</Button>
					</>
				}
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					label="Total Tasks"
					value="128"
					icon={CheckCircle2}
					colorClass="bg-primary"
					trend="+12%"
				/>
				<StatCard
					label="Active Sprints"
					value="3"
					icon={Clock}
					colorClass="bg-accent-purple"
				/>
				<StatCard
					label="Team Members"
					value="24"
					icon={Users}
					colorClass="bg-accent-cyan"
				/>
				<StatCard
					label="PRs Open"
					value="12"
					icon={GitBranch}
					colorClass="bg-accent-pink"
					trend="+4"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<GlassCard className="lg:col-span-2 p-6 flex flex-col justify-between min-h-[300px]">
					<div>
						<div className="flex justify-between items-center mb-6">
							<h3 className="font-bold text-white">Sprint Progress</h3>
							<span className="text-xs font-bold text-primary">
								74% Complete
							</span>
						</div>
						<ProgressBar progress={74} variant="lg" className="mb-8" />
						<div className="grid grid-cols-3 gap-4">
							{[
								{ label: "Todo", value: 12, color: "bg-slate-500" },
								{ label: "In Progress", value: 24, color: "bg-primary" },
								{ label: "Done", value: 45, color: "bg-emerald-500" },
							].map((item) => (
								<div
									key={item.label}
									className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
								>
									<div
										className={`w-2 h-2 rounded-full ${item.color} mb-2`}
									></div>
									<p className="text-2xl font-bold text-white">{item.value}</p>
									<p className="text-[10px] text-slate-500 uppercase font-bold">
										{item.label}
									</p>
								</div>
							))}
						</div>
					</div>
				</GlassCard>

				<GlassCard className="p-6">
					<h3 className="font-bold text-white mb-6">Recent Activity</h3>
					<div className="space-y-6">
						{recentActivities.map((activity) => (
							<ActivityItem key={activity.id} activity={activity} />
						))}
					</div>
					<button className="w-full mt-6 py-2.5 rounded-xl bg-white/[0.03] text-xs font-bold text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all">
						View All Activity
					</button>
				</GlassCard>
			</div>
		</div>
	);
};

export default Dashboard;
