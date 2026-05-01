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
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`flex flex-col items-center justify-center p-12 text-center bg-surface/20 border border-dashed border-border rounded-[32px] ${className}`}
		>
			<div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner">
				<Icon size={32} />
			</div>
			<h3 className="text-xl font-bold text-text-main mb-2 tracking-tight">
				{title}
			</h3>
			<p className="text-text-muted text-sm max-w-[280px] mb-8 leading-relaxed">
				{description}
			</p>
			{actionLabel && onAction && (
				<Button
					variant="primary"
					size="sm"
					onClick={onAction}
					className="px-8 py-2.5 font-bold uppercase tracking-widest text-[10px]"
				>
					{actionLabel}
				</Button>
			)}
		</motion.div>
	);
};

export default EmptyState;
