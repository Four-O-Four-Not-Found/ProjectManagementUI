import React from "react";
import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface StatCardProps {
	label: string;
	value: string | number;
	icon: LucideIcon;
	trend?: string;
	colorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({
	label,
	value,
	icon: Icon,
	trend,
	colorClass,
}) => {
	return (
		<div className="bg-[#1e293b] border border-[#334155] rounded-lg p-3 flex items-center gap-4 hover:border-[#475569] transition-all group relative overflow-hidden">
			<div
				className={twMerge(
					"w-10 h-10 rounded-lg flex items-center justify-center text-[#f8fafc] shrink-0",
					colorClass || "bg-[#38bdf8] text-[#0f172a]",
				)}
			>
				<Icon size={20} />
			</div>

			<div className="flex-1 min-w-0">
				<p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider truncate">
					{label}
				</p>
				<div className="flex items-baseline gap-2">
					<h3 className="text-xl font-bold text-[#f8fafc] group-hover:text-[#38bdf8] transition-colors leading-none">
						{value}
					</h3>
					{trend && (
						<span className="text-[10px] font-bold text-[#38bdf8] flex items-center">
							<TrendingUp size={10} className="mr-1" />
							{trend}
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default StatCard;
