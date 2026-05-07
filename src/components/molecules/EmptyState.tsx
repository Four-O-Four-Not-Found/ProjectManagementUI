import React from "react";
import { type LucideIcon, Target } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../atoms/Button";

interface EmptyStateProps {
	icon?: LucideIcon;
	title: string;
	description: string;
	actionLabel?: string;
	onAction?: () => void;
	className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
	icon: Icon = Target,
	title,
	description,
	actionLabel,
	onAction,
	className = "",
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className={`flex flex-col items-center justify-center p-12 text-center bg-[#1e293b] border border-[#334155] rounded-lg ${className}`}
		>
			<div className="w-16 h-16 rounded bg-[#0f172a] border border-[#334155] flex items-center justify-center text-[#38bdf8] mb-6">
				<Icon size={32} />
			</div>
			<h3 className="text-xl font-black text-[#f8fafc] mb-2 uppercase tracking-wider">
				{title}
			</h3>
			<p className="text-[#94a3b8] text-sm max-w-[320px] mb-8 leading-relaxed font-medium">
				{description}
			</p>
			{actionLabel && onAction && (
				<Button
					variant="primary"
					size="sm"
					onClick={onAction}
					className="px-10 py-3 bg-[#38bdf8] text-[#0f172a] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#7dd3fc]"
				>
					{actionLabel}
				</Button>
			)}
		</motion.div>
	);
};

export default EmptyState;
