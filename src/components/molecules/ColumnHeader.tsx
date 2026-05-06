import React from "react";
import { Plus, Maximize2 } from "lucide-react";

interface ColumnHeaderProps {
	title: string;
	colorClass: string;
	count: number;
	onAdd?: () => void;
	onClickTitle?: () => void;
}

const ColumnHeader: React.FC<ColumnHeaderProps> = ({
	title,
	colorClass,
	count,
	onAdd,
	onClickTitle,
}) => {
	return (
		<div
			className={`flex items-center justify-between mb-2 md:mb-4 px-2 border-l-4 ${colorClass} h-10 group`}
		>
			<button
				onClick={onClickTitle}
				className="flex items-center gap-2 hover:bg-[var(--card-bg)] pr-2 py-1 rounded transition-all text-left"
			>
				<h3 className="font-black text-text-main text-[11px] uppercase tracking-[0.2em]">
					{title}
				</h3>
				<span className="text-[10px] bg-surface/50 border border-border px-1.5 py-0.5 rounded-md text-text-muted font-black min-w-[20px] text-center">
					{count}
				</span>
				<Maximize2
					size={10}
					className="text-primary opacity-0 group-hover:opacity-100 md:hidden transition-opacity"
				/>
			</button>
			<button
				onClick={onAdd}
				className="p-1.5 rounded-lg hover:bg-success/20 text-text-muted hover:text-success transition-all active:scale-95"
			>
				<Plus size={16} />
			</button>
		</div>
	);
};

export default ColumnHeader;
