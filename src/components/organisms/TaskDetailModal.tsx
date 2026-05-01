import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	Paperclip,
	Clock,
	Send,
	Plus,
	Image as ImageIcon,
	AlertCircle,
	Lightbulb,
	CheckCircle2,
	User,
} from "lucide-react";
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";
import Badge from "../atoms/Badge";
import BaseModal from "../molecules/BaseModal";
import { useAuthStore } from "../../store/useAuthStore";
import type { Task } from "../../types";

interface TaskDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	task: Task;
	onAssign?: (taskId: string, profileId: string) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
	isOpen,
	onClose,
	task,
	onAssign,
}) => {
	const { user } = useAuthStore();
	const [comment, setComment] = useState("");
	const [activeTab, setActiveTab] = useState<
		"details" | "activity" | "attachments"
	>("details");

	const modalHeader = (
		<div className="space-y-1">
			<div className="flex items-center gap-3">
				<span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
					{task.taskId}
				</span>
				<div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface border border-border">
					{task.type === "Issue" && (
						<AlertCircle size={10} className="text-rose-500" />
					)}
					{task.type === "Suggestion" && (
						<Lightbulb size={10} className="text-amber-500" />
					)}
					{task.type === "Feature" && (
						<CheckCircle2 size={10} className="text-primary" />
					)}
					<span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">
						{task.type}
					</span>
				</div>
			</div>
			<h2 className="text-lg font-bold text-text-main tracking-tight">
				{task.title}
			</h2>
		</div>
	);

	return (
		<BaseModal isOpen={isOpen} onClose={onClose} title={modalHeader} size="xl">
			<div className="flex flex-col md:flex-row min-h-[500px]">
				{/* Left Content */}
				<div className="flex-1 p-2 md:p-4">
					<div className="flex gap-6 border-b border-border mb-6">
						{(["details", "activity", "attachments"] as const).map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`pb-3 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
									activeTab === tab
										? "text-primary"
										: "text-text-muted hover:text-text-main"
								}`}
							>
								{tab}
								{activeTab === tab && (
									<motion.div
										layoutId="activeTabDetail"
										className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_rgba(56,189,248,0.4)]"
									/>
								)}
							</button>
						))}
					</div>

					{activeTab === "details" && (
						<div className="space-y-6 animate-fade-in">
							<div className="prose prose-invert max-w-none">
								<h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">
									Description
								</h3>
								<div className="text-sm text-text-main leading-relaxed bg-surface-hover/30 p-4 rounded-xl border border-border">
									{task.description ||
										"No description provided for this entry."}
								</div>
							</div>

							<div>
								<h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">
									Visual Evidence / Attachments
								</h3>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
									{task.attachments
										?.filter((a) => a.type === "image")
										.map((img) => (
											<div
												key={img.id}
												className="aspect-video rounded-xl overflow-hidden border border-border group relative cursor-pointer"
											>
												<img
													src={img.url}
													alt={img.name}
													className="w-full h-full object-cover transition-transform group-hover:scale-110"
												/>
												<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
													<Plus className="text-white" />
												</div>
											</div>
										))}
									<button className="aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group">
										<ImageIcon
											size={18}
											className="text-text-muted group-hover:text-primary transition-colors"
										/>
										<span className="text-[9px] font-bold text-text-muted uppercase group-hover:text-primary transition-colors">
											Add Image
										</span>
									</button>
								</div>
							</div>
						</div>
					)}

					{activeTab === "activity" && (
						<div className="space-y-5 animate-fade-in">
							{task.comments?.map((comment) => (
								<div key={comment.id} className="flex gap-3">
									<Avatar name={comment.userName} size="sm" />
									<div className="flex-1 bg-surface-hover/20 rounded-xl p-3 border border-border">
										<div className="flex items-center justify-between mb-1.5">
											<span className="text-xs font-bold text-text-main">
												{comment.userName}
											</span>
											<span className="text-[9px] text-text-muted">
												{comment.timestamp}
											</span>
										</div>
										<p className="text-xs text-text-muted leading-relaxed">
											{comment.content}
										</p>
									</div>
								</div>
							))}
							<div className="flex gap-3 mt-6">
								<Avatar name="You" size="sm" />
								<div className="flex-1 relative">
									<textarea
										value={comment}
										onChange={(e) => setComment(e.target.value)}
										placeholder="Add a suggestion or comment..."
										className="w-full bg-background border border-border rounded-xl p-3 text-sm text-text-main placeholder:text-text-muted/50 outline-none focus:border-primary/50 transition-all min-h-[80px] resize-none"
									/>
									<div className="absolute bottom-2 right-2 flex items-center gap-2">
										<button className="p-1.5 text-text-muted hover:text-text-main transition-colors">
											<Paperclip size={16} />
										</button>
										<Button
											size="xs"
											className="h-8 px-3"
											rightIcon={<Send size={14} />}
										>
											Post
										</Button>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Sidebar Details */}
				<div className="w-full md:w-64 bg-surface-hover/30 border-l border-border p-4 md:p-6 space-y-6">
					<div>
						<h3 className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-3">
							Properties
						</h3>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-[10px] text-text-muted">Status</span>
								<Badge variant="primary" size="xs">
									{task.status}
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[10px] text-text-muted">Priority</span>
								<Badge
									variant={task.priority === "Urgent" ? "danger" : "warning"}
									size="xs"
								>
									{task.priority}
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[10px] text-text-muted">Entry Type</span>
								<select
									className="bg-transparent text-[10px] font-bold text-primary outline-none cursor-pointer"
									value={task.type}
								>
									<option value="Feature">Feature</option>
									<option value="Issue">Issue</option>
									<option value="Suggestion">Suggestion</option>
								</select>
							</div>
						</div>
					</div>

					<div>
						<h3 className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-3">
							Assignee
						</h3>
						{!task.assignee ||
						!task.assignee.name ||
						task.assignee.name === "Unassigned" ? (
							<div className="space-y-3">
								<div className="flex items-center gap-3 bg-background/50 p-2.5 rounded-xl border border-border border-dashed">
									<div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted">
										<User size={16} />
									</div>
									<p className="text-[11px] font-bold text-text-muted italic">
										Waiting for volunteer
									</p>
								</div>
								<Button
									size="xs"
									className="w-full h-8"
									variant="primary"
									onClick={() => user && onAssign?.(task.id, user.id)}
								>
									Volunteer for Task
								</Button>
							</div>
						) : (
							<div className="flex items-center gap-3 bg-background p-2.5 rounded-xl border border-border">
								<Avatar name={task.assignee.name} size="xs" />
								<div className="min-w-0">
									<p className="text-[11px] font-bold text-text-main truncate">
										{task.assignee.name}
									</p>
									<p className="text-[9px] text-text-muted truncate">
										Core Team Member
									</p>
								</div>
							</div>
						)}
					</div>

					<div>
						<h3 className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-3">
							Timeline
						</h3>
						<div className="space-y-2.5">
							<div className="flex items-center gap-2 text-[10px] text-text-muted">
								<Clock size={12} className="text-text-muted/50" />
								<span>Created Apr 10</span>
							</div>
							<div className="flex items-center gap-2 text-[10px] text-text-muted">
								<Clock size={12} className="text-text-muted/50" />
								<span>Updated 2h ago</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</BaseModal>
	);
};

export default TaskDetailModal;
