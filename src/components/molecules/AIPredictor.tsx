import React, { useMemo } from "react";
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import GlassCard from "./GlassCard";
import type { Task, Sprint } from "../../types";

interface AIPredictorProps {
	tasks: Task[];
	sprint: Sprint | null;
	className?: string;
}

const AIPredictor: React.FC<AIPredictorProps> = ({ tasks, sprint, className }) => {
	const analysis = useMemo(() => {
		if (!sprint || tasks.length === 0) return null;

		const completed = tasks.filter(t => t.status === "Done").length;
		const total = tasks.length;
		const completionRate = (completed / total) * 100;
		
		// Heuristic: Overdue tasks and high-priority backlog impact success
		const highPriority = tasks.filter(t => (t.priority === "Urgent" || t.priority === "High") && t.status !== "Done").length;
		const bugCount = tasks.filter(t => t.type === "Bug" && t.status !== "Done").length;

		let successProbability = 100 - (highPriority * 10) - (bugCount * 5);
		if (completionRate > 50) successProbability += 10;
		successProbability = Math.min(Math.max(successProbability, 0), 98); // Never 100% because "AI"

		return {
			probability: Math.round(successProbability),
			completionRate: Math.round(completionRate),
			highPriority,
			bugCount,
			risk: successProbability < 60 ? "High" : successProbability < 85 ? "Moderate" : "Low"
		};
	}, [tasks, sprint]);

	if (!analysis) return null;

	return (
		<GlassCard className={className}>
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<div className="p-2 bg-primary/10 rounded-lg text-primary animate-pulse">
						<Sparkles size={18} />
					</div>
					<div>
						<h3 className="text-xs font-bold text-text-main">AI Sprint Analyst</h3>
						<p className="text-[10px] text-text-muted uppercase tracking-widest">Heuristic Prediction</p>
					</div>
				</div>
				<div className={`px-2 py-1 rounded text-[10px] font-bold ${
					analysis.risk === "High" ? "bg-danger/10 text-danger" : 
					analysis.risk === "Moderate" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
				}`}>
					{analysis.risk} Risk
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-end gap-3">
					<div className="text-3xl font-black text-text-main tabular-nums">
						{analysis.probability}%
					</div>
					<div className="text-[10px] text-text-muted pb-1">
						Success Probability
					</div>
				</div>

				<div className="h-1.5 w-full bg-surface-hover rounded-full overflow-hidden">
					<div 
						className={`h-full transition-all duration-1000 ${
							analysis.probability < 60 ? "bg-danger" : 
							analysis.probability < 85 ? "bg-warning" : "bg-primary"
						}`}
						style={{ width: `${analysis.probability}%` }}
					/>
				</div>

				<div className="grid grid-cols-2 gap-3 pt-2">
					<div className="p-3 bg-background/50 border border-border rounded-xl">
						<div className="flex items-center gap-2 text-[10px] font-bold text-text-muted mb-1 uppercase">
							<TrendingUp size={12} /> Velocity
						</div>
						<div className="text-sm font-bold text-text-main">{analysis.completionRate}% Done</div>
					</div>
					<div className="p-3 bg-background/50 border border-border rounded-xl">
						<div className="flex items-center gap-2 text-[10px] font-bold text-text-muted mb-1 uppercase">
							<AlertTriangle size={12} /> Blockers
						</div>
						<div className="text-sm font-bold text-text-main">{analysis.bugCount} Bugs</div>
					</div>
				</div>

				<div className="bg-primary/5 border border-primary/10 p-3 rounded-xl flex gap-3">
					<CheckCircle size={16} className="text-primary shrink-0 mt-0.5" />
					<p className="text-[11px] text-text-muted leading-relaxed italic">
						"Based on the current trajectory and high-priority volume, the sprint is trending {analysis.risk.toLowerCase()}. Recommendation: Resolve remaining bugs to stabilize velocity."
					</p>
				</div>
			</div>
		</GlassCard>
	);
};

export default AIPredictor;
