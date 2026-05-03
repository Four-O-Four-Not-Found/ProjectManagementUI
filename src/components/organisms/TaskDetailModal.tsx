import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
	Clock,
	Send,
	Plus,
	Image as ImageIcon,
	AlertCircle,
	Lightbulb,
	CheckCircle2,
	User,
	Calendar,
	Sparkles,
	Wand2,
	Loader2,
	Edit2,
	Check,
	X,
} from "lucide-react";
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";
import Badge from "../atoms/Badge";
import BaseModal from "../molecules/BaseModal";
import { useAuthStore } from "../../store/useAuthStore";
import { projectService } from "../../services/projectService";
import { useToast } from "../../hooks/useToast";
import type { Task } from "../../types";

interface TaskDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	task: Task;
	onAssign?: (taskId: string, userId: string) => void;
	onRefresh?: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
	isOpen,
	onClose,
	task,
	onAssign,
	onRefresh,
}) => {
	const { user } = useAuthStore();
	const { success, error: toastError } = useToast();
	const [comment, setComment] = useState("");
	const [isDecomposing, setIsDecomposing] = useState(false);
	const [activeTab, setActiveTab] = useState<
		"details" | "activity" | "attachments"
	>("details");
	const [isEditing, setIsEditing] = useState(false);
	const [editedTitle, setEditedTitle] = useState(task.title);
	const [editedDescription, setEditedDescription] = useState(task.description);
	const [isSaving, setIsSaving] = useState(false);
	const [isPostingComment, setIsPostingComment] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDecompose = async () => {
		setIsDecomposing(true);
		try {
			await projectService.decomposeTask(task.id);
			success("Task Decomposed", "AI has generated a breakdown for this task.");
			onRefresh?.();
			toastError(
				"Decomposition Failed",
				"Could not generate sub-tasks."
			);
		} finally {
			setIsDecomposing(false);
		}
	};

	const handleUpdateTask = async () => {
		if (!user) return;
		setIsSaving(true);
		try {
			await projectService.updateTaskDetails(
				task.id,
				user.id,
				editedTitle,
				editedDescription,
			);
			success("Task Updated", "Changes saved successfully.");
			setIsEditing(false);
			onRefresh?.();
		} catch (err) {
			toastError("Update Failed", "Could not save changes.\nDetails: " + err);
		} finally {
			setIsSaving(false);
		}
	};

	const handlePostComment = async () => {
		if (!user || !comment.trim()) return;
		setIsPostingComment(true);
		try {
			await projectService.addComment(task.id, user.id, comment);
			setComment("");
			success("Comment Posted", "Your message has been added.");
			onRefresh?.();
		} catch {
			toastError("Post Failed", "Could not add comment.");
		} finally {
			setIsPostingComment(false);
		}
	};

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !user) return;

		try {
			await projectService.addAttachment(task.id, {
				fileName: file.name,
				fileUrl:
					"https://via.placeholder.com/800x450.png?text=" +
					encodeURIComponent(file.name),
				fileType: file.type,
				fileSize: file.size,
			});
			success("Attachment Added", "File uploaded successfully.");
			onRefresh?.();
		} catch {
			toastError("Upload Failed", "Could not add attachment.");
		}
	};

	const modalHeader = (
		<div className="flex items-center justify-between w-full pr-8">
			<div className="space-y-1">
				<div className="flex items-center gap-3">
					<span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
						{task.taskKey}
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
				{isEditing ? (
					<input
						value={editedTitle}
						onChange={(e) => setEditedTitle(e.target.value)}
						className="text-lg font-bold text-text-main tracking-tight bg-background border border-primary/30 rounded px-2 py-0.5 outline-none focus:border-primary w-full max-w-lg"
						autoFocus
					/>
				) : (
					<h2 className="text-lg font-bold text-text-main tracking-tight">
						{task.title}
					</h2>
				)}
			</div>

			<div className="flex items-center gap-2">
				{isEditing ? (
					<>
						<Button
							size="xs"
							variant="secondary"
							className="h-8 px-2"
							onClick={() => {
								setIsEditing(false);
								setEditedTitle(task.title);
								setEditedDescription(task.description);
							}}
						>
							<X size={14} />
						</Button>
						<Button
							size="xs"
							variant="primary"
							className="h-8 px-3"
							loading={isSaving}
							onClick={handleUpdateTask}
							leftIcon={<Check size={14} />}
						>
							Save
						</Button>
					</>
				) : (
					<Button
						size="xs"
						variant="secondary"
						className="h-8 px-3"
						onClick={() => setIsEditing(true)}
						leftIcon={<Edit2 size={14} />}
					>
						Edit
					</Button>
				)}
			</div>
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
								{tab === "details" ? "Task Info" : tab === "activity" ? "Discussion" : "Files"}
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
						<div className="space-y-8 animate-fade-in">
							<div>
								<h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">
									Description
								</h3>
								{isEditing ? (
									<textarea
										value={editedDescription}
										onChange={(e) => setEditedDescription(e.target.value)}
										className="w-full bg-background border border-border rounded-xl p-4 text-sm text-text-main placeholder:text-text-muted/50 outline-none focus:border-primary/50 transition-all min-h-[150px] resize-none"
										placeholder="Describe the task and any technical requirements..."
									/>
								) : (
									<div className="text-sm text-text-main leading-relaxed bg-surface-hover/30 p-4 rounded-xl border border-border whitespace-pre-wrap">
										{task.description || "No description provided for this entry."}
									</div>
								)}
							</div>

							{task.subTasks && task.subTasks.length > 0 && (
								<div className="space-y-3">
									<h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
										<Wand2 size={12} className="text-primary" />
										AI Breakdown / Sub-tasks
									</h3>
									<div className="space-y-2">
										{task.subTasks.map((sub) => (
											<div
												key={sub.id}
												className="flex items-center justify-between p-3 bg-surface border border-border rounded-lg group hover:border-primary/50 transition-colors"
											>
												<div className="flex items-center gap-3">
													<div className="w-1.5 h-1.5 rounded-full bg-primary" />
													<span className="text-xs font-medium text-text-main">
														{sub.title}
													</span>
												</div>
												<div className="flex items-center gap-3">
													<span className="text-[9px] font-mono text-text-muted">
														{sub.taskKey}
													</span>
													<Badge size="xs" variant="primary">
														{sub.status}
													</Badge>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							<div>
								<h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">
									Visual Evidence / Attachments
								</h3>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
									{task.attachments
										?.map((img) => (
											<div
												key={img.id}
												className="aspect-video rounded-xl overflow-hidden border border-border group relative cursor-pointer"
											>
												<img
													src={img.fileUrl}
													alt={img.fileName}
													className="w-full h-full object-cover transition-transform group-hover:scale-110"
												/>
												<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
													<Plus className="text-white" />
												</div>
											</div>
										))}
									<input 
										type="file" 
										ref={fileInputRef} 
										className="hidden" 
										onChange={handleFileUpload}
										accept="image/*"
									/>
									<button 
										onClick={() => fileInputRef.current?.click()}
										className="aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group"
									>
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
							{task.comments && task.comments.length > 0 ? (
								task.comments.map((comment) => (
									<div key={comment.id} className="flex gap-3">
										<Avatar name={comment.user?.displayName || "User"} src={comment.user?.avatarUrl} size="sm" />
										<div className="flex-1 bg-surface-hover/20 rounded-xl p-3 border border-border">
											<div className="flex items-center justify-between mb-1.5">
												<span className="text-xs font-bold text-text-main">
													{comment.user?.displayName}
												</span>
												<span className="text-[9px] text-text-muted">
													{new Date(comment.createdAt).toLocaleString()}
												</span>
											</div>
											<p className="text-xs text-text-muted leading-relaxed">
												{comment.content}
											</p>
										</div>
									</div>
								))
							) : (
								<div className="flex flex-col items-center justify-center py-10 opacity-50">
									<p className="text-xs text-text-muted">No activity yet. Be the first to comment!</p>
								</div>
							)}
							<div className="flex gap-3 mt-6">
								<Avatar name={user?.displayName || "You"} src={user?.avatarUrl} size="sm" />
								<div className="flex-1 relative">
									<textarea
										value={comment}
										onChange={(e) => setComment(e.target.value)}
										placeholder="Add a suggestion or comment..."
										className="w-full bg-background border border-border rounded-xl p-3 text-sm text-text-main placeholder:text-text-muted/50 outline-none focus:border-primary/50 transition-all min-h-[80px] resize-none"
									/>
									<div className="absolute bottom-2 right-2 flex items-center gap-2">
										<Button
											size="xs"
											className="h-8 px-3"
											rightIcon={<Send size={14} />}
											onClick={handlePostComment}
											loading={isPostingComment}
											disabled={!comment.trim()}
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
							AI Co-Pilot
						</h3>
						<Button
							variant="secondary"
							size="xs"
							className="w-full h-8 bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary group"
							onClick={handleDecompose}
							disabled={isDecomposing}
							leftIcon={
								isDecomposing ? (
									<Loader2 size={14} className="animate-spin" />
								) : (
									<Sparkles
										size={14}
										className="group-hover:scale-110 transition-transform"
									/>
								)
							}
						>
							{isDecomposing ? "Planning..." : "AI Breakdown"}
						</Button>
					</div>

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
								<span className="text-[10px] text-text-muted">Category</span>
								<select
									className="bg-transparent text-[10px] font-bold text-primary outline-none cursor-pointer"
									value={task.type}
								>
									<option value="Feature">Feature</option>
									<option value="Bug">Bug</option>
									<option value="Suggestion">Suggestion</option>
									<option value="Issue">Issue</option>
								</select>
							</div>
						</div>
					</div>

					<div>
						<h3 className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-3">
							Assignees
						</h3>
						<div className="space-y-3">
							{task.taskAssignees && task.taskAssignees.length > 0 ? (
								<div className="space-y-2">
									{task.taskAssignees.map((ta) => (
										<div
											key={ta.user.id}
											className="flex items-center gap-3 bg-background p-2.5 rounded-xl border border-border"
										>
											<Avatar
												name={ta.user.displayName}
												src={ta.user.avatarUrl}
												size="xs"
											/>
											<div className="min-w-0">
												<p className="text-[11px] font-bold text-text-main truncate">
													{ta.user.displayName}
												</p>
												<p className="text-[9px] text-text-muted truncate">
													Collaborator
												</p>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="flex items-center gap-3 bg-background/50 p-2.5 rounded-xl border border-border border-dashed">
									<div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted">
										<User size={16} />
									</div>
									<p className="text-[11px] font-bold text-text-muted italic">
										Waiting for volunteer
									</p>
								</div>
							)}

							{user &&
								!task.taskAssignees?.some((ta) => ta.user.id === user.id) && (
									<Button
										size="xs"
										className="w-full h-8"
										variant="primary"
										onClick={() => onAssign?.(task.id, user.id)}
									>
										{task.taskAssignees?.length
											? "Join Task"
											: "Volunteer for Task"}
									</Button>
								)}
						</div>
					</div>

					<div>
						<h3 className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-3">
							Deadline
						</h3>
						{task.dueDate ? (
							<div
								className={`flex items-center gap-3 p-2.5 rounded-xl border ${new Date(task.dueDate) < new Date() && task.status !== "Closed" ? "bg-danger/10 border-danger/20 text-danger" : "bg-background border-border text-text-main"}`}
							>
								<Calendar size={16} />
								<div className="min-w-0">
									<p className="text-[11px] font-bold">
										{new Date(task.dueDate).toLocaleDateString(undefined, {
											month: "long",
											day: "numeric",
											year: "numeric",
										})}
									</p>
									<p className="text-[9px] opacity-70">
										{new Date(task.dueDate) < new Date() &&
										task.status !== "Closed"
											? "Overdue"
											: "Scheduled Completion"}
									</p>
								</div>
							</div>
						) : (
							<p className="text-[10px] text-text-muted italic px-1">
								No deadline set.
							</p>
						)}
					</div>

					<div>
						<h3 className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-3">
							History
						</h3>
						<div className="space-y-2.5">
							<div className="flex items-center gap-2 text-[10px] text-text-muted">
								<Clock size={12} className="text-text-muted/50" />
								<span>
									Created {new Date(task.createdAt).toLocaleDateString()}
								</span>
							</div>
							<div className="flex items-center gap-2 text-[10px] text-text-muted">
								<Clock size={12} className="text-text-muted/50" />
								<span>
									Updated {new Date(task.updatedAt).toLocaleDateString()}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</BaseModal>
	);
};

export default TaskDetailModal;
