import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
	Send,
	Plus,
	Calendar,
	Sparkles,
	Wand2,
	Loader2,
	Edit2,
	MessageSquare,
	CircleDot,
	GitBranch,
	Settings,
	AlertCircle,
	Lightbulb,
	CheckCircle2,
	Bookmark,
	Link as LinkIcon,
} from "lucide-react";
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";
import Badge from "../atoms/Badge";
import BaseModal from "../molecules/BaseModal";
import { useAuthStore } from "../../store/useAuthStore";
import { projectService } from "../../services/projectService";
import { useToast } from "../../hooks/useToast";
import { useProject } from "../../hooks/useProject";
import type { Task } from "../../types";

interface TaskDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	task: Task;
	onRefresh?: () => void;
}

const TypeIcon = ({ type }: { type: Task["type"] }) => {
	switch (type) {
		case "Issue":
			return <AlertCircle size={12} className="text-gray-500" />;
		case "Suggestion":
			return <Lightbulb size={12} className="text-gray-400" />;
		case "Bug":
			return <AlertCircle size={12} className="text-[#da3633]" />;
		case "Feature":
			return <CheckCircle2 size={12} className="text-[#238636]" />;
		default:
			return <Bookmark size={12} className="text-gray-500" />;
	}
};


const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
	isOpen,
	onClose,
	task,
	onRefresh,
}) => {
	const { user } = useAuthStore();
	const { activeProject } = useProject();
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

	const { assignTask, addComment } = useProject();

	const handleDecompose = async () => {
		setIsDecomposing(true);
		try {
			await projectService.decomposeTask(task.id);
			success("Task Decomposed", "AI has generated a breakdown for this task.");
			onRefresh?.();
		} catch {
			toastError("Decomposition Failed", "Could not generate sub-tasks.");
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

	const handleDeleteTask = async () => {
		if (!user || !window.confirm("Are you sure you want to delete this task?"))
			return;
		setIsSaving(true);
		try {
			await projectService.deleteTask(task.id, user.id);
			success("Task Deleted", "The task has been removed.");
			onClose();
			onRefresh?.();
		} catch (err) {
			toastError(
				"Delete Failed",
				"You may not have permission to delete this task.\nDetails: " + err,
			);
		} finally {
			setIsSaving(false);
		}
	};


	const handlePostComment = async () => {
		if (!user || !comment.trim()) return;
		setIsPostingComment(true);
		try {
			await addComment(task.id, user.id, comment);
			setComment("");
			success("Comment Posted", "Your message has been added.");
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
		<div className="flex flex-col w-full pr-8 py-1">
			<div className="flex items-start justify-between gap-4">
				<div className="flex-1 min-w-0">
					{isEditing ? (
						<input
							value={editedTitle}
							onChange={(e) => setEditedTitle(e.target.value)}
							className="text-2xl font-semibold text-[var(--text-main)] bg-[var(--background)] border border-[var(--border-subtle)] rounded-github px-3 py-1 outline-none focus:border-[var(--color-primary)] w-full transition-all"
							autoFocus
						/>
					) : (
						<h2 className="text-2xl font-semibold text-[var(--text-main)] tracking-tight leading-tight">
							{task.title} <span className="text-[var(--text-muted)] font-light ml-1">#{task.taskKey?.split('-').pop() || "???"}</span>
						</h2>
					)}
				</div>
				<div className="flex items-center gap-2 shrink-0">
					{isEditing ? (
						<>
							<Button size="sm" variant="primary" onClick={handleUpdateTask} loading={isSaving}>Save</Button>
							<Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
						</>
					) : (
						<div className="flex items-center gap-2">
							<Button size="sm" variant="secondary" onClick={() => setIsEditing(true)} leftIcon={<Edit2 size={14} />}>Edit</Button>
							<Button 
								size="sm" 
								variant="secondary" 
								className="text-red-500 hover:text-red-600 hover:bg-red-50"
								onClick={handleDeleteTask} 
								loading={isSaving}
							>
								Delete
							</Button>
						</div>
					)}
				</div>
			</div>
			
			<div className="flex items-center gap-2 mt-3 text-[13px] text-[var(--text-muted)]">
				<Badge 
					variant={task.status === "Closed" ? "purple" : "success"} 
					className="flex items-center gap-1 py-1 px-3 rounded-full font-medium"
				>
					<CircleDot size={14} />
					{task.status === "Closed" ? "Closed" : "Open"}
				</Badge>
				<div className="flex items-center gap-1.5 ml-1">
					<TypeIcon type={task.type} />
					<span className="font-semibold text-[var(--text-main)]">
						{task.taskAssignees?.[0]?.user?.displayName || "Unassigned"}
					</span>
				</div>
				<span>opened this {task.type?.toLowerCase() || "item"}</span>
				<span>•</span>
				<span>{task.comments?.length || 0} comments</span>
			</div>
		</div>
	);

	return (
		<BaseModal isOpen={isOpen} onClose={onClose} title={modalHeader} size="xl">
			<div className="flex flex-col md:flex-row min-h-[600px] bg-[var(--background)]">
				{/* Left Content (Discussion/Description) */}
				<div className="flex-1 p-6 md:p-8 border-r border-[var(--border)]">
					<div className="space-y-6">
						<div className="glass-card rounded-github overflow-hidden">
							<div className="px-4 py-2 bg-[var(--surface-hover)] border-b border-[var(--border)] flex items-center justify-between">
								<div className="flex items-center gap-2">
									<span className="font-semibold text-[13px]">{task.taskAssignees?.[0]?.user?.displayName || "author"}</span>
									<span className="text-[var(--text-muted)] text-[13px]">commented on {new Date(task.createdAt).toLocaleDateString()}</span>
								</div>
								<div className="px-2 py-0.5 rounded-full border border-[var(--border)] text-[11px] text-[var(--text-muted)] font-medium">
									Author
								</div>
							</div>
							<div className="p-4 bg-[var(--surface)]">
								{isEditing ? (
									<textarea
										value={editedDescription}
										onChange={(e) => setEditedDescription(e.target.value)}
										className="w-full bg-[var(--background)] border border-[var(--border-subtle)] rounded-github p-4 text-[14px] text-[var(--text-main)] outline-none focus:border-[var(--color-primary)] min-h-[200px] resize-none"
									/>
								) : (
									<div className="text-[14px] text-[var(--text-main)] leading-relaxed whitespace-pre-wrap">
										{task.description || "No description provided."}
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="mt-8 flex gap-4 border-b border-[var(--border)]">
						{(["details", "activity", "attachments"] as const).map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`pb-2 text-[14px] font-medium transition-all relative ${
									activeTab === tab
										? "text-[var(--text-main)]"
										: "text-[var(--text-muted)] hover:text-[var(--text-main)]"
								}`}
							>
								{tab === "details" ? "Overview" : tab === "activity" ? "Discussion" : "Files"}
								{activeTab === tab && (
									<motion.div
										layoutId="activeTabDetail"
										className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#f78166]"
									/>
								)}
							</button>
						))}
					</div>
 
					<div className="animate-fade-in">
						{activeTab === "details" && (
							<div className="space-y-10">
								<div>
									<h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
										Description
									</h3>
									{isEditing ? (
										<textarea
											value={editedDescription}
											onChange={(e) => setEditedDescription(e.target.value)}
											className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:border-gray-400 dark:focus:border-gray-600 transition-all min-h-[250px] resize-none"
											placeholder="Write a detailed task description..."
										/>
									) : (
										<div className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">
											{task.description || "No description provided for this task."}
										</div>
									)}
								</div>
 
								{task.subTasks && task.subTasks.length > 0 && (
									<div className="space-y-4">
										<h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
											<Wand2 size={12} />
											Sub-tasks
										</h3>
										<div className="grid gap-2">
											{task.subTasks.map((sub) => (
												<div
													key={sub.id}
													className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl hover:border-gray-200 dark:hover:border-white/10 transition-colors"
												>
													<div className="flex items-center gap-3">
														<div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
														<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
															{sub.title}
														</span>
													</div>
													<Badge size="xs" variant="secondary">
														{sub.status}
													</Badge>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						)}
 
						{activeTab === "activity" && (
							<div className="space-y-8">
								<div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
									{task.comments && task.comments.length > 0 ? (
										task.comments.map((comment) => (
											<div key={comment.id} className="flex gap-4">
												<Avatar
													name={comment.user?.displayName || "User"}
													src={comment.user?.avatarUrl}
													size="sm"
												/>
												<div className="flex-1 space-y-1.5">
													<div className="flex items-center justify-between">
														<span className="text-xs font-bold text-gray-900 dark:text-white">
															{comment.user?.displayName}
														</span>
														<span className="text-[10px] text-gray-400 font-medium">
															{new Date(comment.createdAt).toLocaleDateString()}
														</span>
													</div>
													<div className="bg-gray-50 dark:bg-white/5 rounded-2xl rounded-tl-none p-4 border border-gray-100 dark:border-white/5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
														{comment.content}
													</div>
												</div>
											</div>
										))
									) : (
										<div className="flex flex-col items-center justify-center py-20 text-gray-400 opacity-50">
											<MessageSquare size={40} strokeWidth={1} />
											<p className="mt-4 text-sm font-medium italic">No discussions yet.</p>
										</div>
									)}
								</div>
 
								<div className="flex gap-4 pt-6 border-t border-gray-100 dark:border-white/5">
									<Avatar
										name={user?.displayName || "You"}
										src={user?.avatarUrl}
										size="sm"
									/>
									<div className="flex-1 relative group">
										<textarea
											value={comment}
											onChange={(e) => setComment(e.target.value)}
											placeholder="Write a comment..."
											className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-white/10 rounded-2xl p-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:border-gray-400 dark:focus:border-gray-600 transition-all min-h-[100px] resize-none shadow-sm"
										/>
										<div className="absolute bottom-3 right-3">
											<Button
												size="sm"
												className="h-9 px-5 rounded-xl shadow-lg"
												rightIcon={<Send size={14} />}
												onClick={handlePostComment}
												loading={isPostingComment}
												disabled={!comment.trim()}
											>
												Send
											</Button>
										</div>
									</div>
								</div>
							</div>
						)}
 
						{activeTab === "attachments" && (
							<div className="space-y-6">
								<div className="grid grid-cols-2 md:grid-cols-3 gap-6">
									{task.attachments?.map((img) => (
										<div
											key={img.id}
											className="aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 group relative cursor-pointer shadow-sm hover:shadow-md transition-all"
										>
											<img
												src={img.fileUrl}
												alt={img.fileName}
												className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
											/>
											<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 text-center">
												<span className="text-white text-[10px] font-bold truncate w-full">{img.fileName}</span>
												<Button size="xs" variant="secondary" className="bg-white/10 border-white/20 text-white backdrop-blur-md">View Full</Button>
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
										className="aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-3 group"
									>
										<div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400 group-hover:text-gray-600 dark:group-hover:text-white transition-colors">
											<Plus size={20} />
										</div>
										<span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
											Add Attachment
										</span>
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
				{/* Right Sidebar (Metadata) */}
				<div className="w-full md:w-[280px] p-6 space-y-6 shrink-0 bg-[var(--background)]">
					<div className="space-y-6">
						<div>
							<div className="flex items-center justify-between mb-2">
								<h3 className="text-[12px] font-semibold text-[var(--text-muted)]">Assignees</h3>
								<Settings size={14} className="text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer" />
							</div>
							<div className="space-y-2">
								{task.taskAssignees && task.taskAssignees.length > 0 ? (
									task.taskAssignees.map((ta) => (
										<div key={ta.id || ta.userId} className="flex items-center gap-2 group">
											<Avatar 
												src={ta.user?.avatarUrl} 
												name={ta.user?.displayName || "Unknown User"} 
												size="xs" 
												className="w-5 h-5"
											/>
											<span className="text-[12px] font-medium text-[var(--text-main)] hover:text-[var(--color-primary)] cursor-pointer truncate">
												{ta.user?.displayName || "Assignee"}
											</span>
										</div>
									))
								) : (
									<p className="text-[12px] text-[var(--text-muted)]">No one—<span className="text-[var(--color-primary)] cursor-pointer hover:underline" onClick={() => user && assignTask(task.id, user.id)}>assign yourself</span></p>
								)}
							</div>
						</div>

						<div className="border-t border-[var(--border)] pt-4">
							<div className="flex items-center justify-between mb-2">
								<h3 className="text-[12px] font-semibold text-[var(--text-muted)]">Labels</h3>
								<Settings size={14} className="text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer" />
							</div>
							<div className="flex flex-wrap gap-1">
								<Badge variant={task.priority === "Urgent" ? "danger" : task.priority === "High" ? "warning" : "secondary"} className="rounded-full text-[11px] px-2">
									{task.priority}
								</Badge>
								<Badge variant="secondary" className="rounded-full text-[11px] px-2 font-mono">
									{task.type}
								</Badge>
							</div>
						</div>

						<div className="border-t border-[var(--border)] pt-4">
							<h3 className="text-[12px] font-semibold text-[var(--text-muted)] mb-2">Projects</h3>
							<div className="text-[12px] font-medium text-[var(--text-main)] hover:text-[var(--color-primary)] cursor-pointer truncate">
								{activeProject?.name || "No project"}
							</div>
						</div>

						{task.parentTaskId && (
							<div className="border-t border-[var(--border)] pt-4">
								<h3 className="text-[12px] font-semibold text-[var(--text-muted)] mb-2">Hierarchy</h3>
								<div className="flex items-center gap-2 text-[11px] font-medium text-[var(--color-primary)] hover:underline cursor-pointer">
									<LinkIcon size={12} />
									<span>Parent Task Connected</span>
								</div>
							</div>
						)}

						<div className="border-t border-[var(--border)] pt-4">
							<h3 className="text-[12px] font-semibold text-[var(--text-muted)] mb-2">Development</h3>
							{task.branchName ? (
								<div className="flex items-center gap-2 text-[12px] font-mono text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-1 rounded-github border border-[var(--color-primary)]/20">
									<GitBranch size={12} />
									<span className="truncate">{task.branchName}</span>
								</div>
							) : (
								<p className="text-[12px] text-[var(--text-muted)] italic">No branch linked</p>
							)}
						</div>

						<div className="border-t border-[var(--border)] pt-4">
							<h3 className="text-[12px] font-semibold text-[var(--text-muted)] mb-2">Timeline</h3>
							{task.dueDate ? (
								<div className="flex items-center gap-2 text-[12px] text-[var(--text-main)]">
									<Calendar size={14} className="text-[var(--text-muted)]" />
									<span>Due on {new Date(task.dueDate).toLocaleDateString()}</span>
								</div>
							) : (
								<p className="text-[12px] text-[var(--text-muted)] italic font-light">No deadline</p>
							)}
						</div>

						<div className="border-t border-[var(--border)] pt-4">
							<h3 className="text-[12px] font-semibold text-[var(--text-muted)] mb-3">AI Breakdown</h3>
							<Button
								variant="secondary"
								size="sm"
								className="w-full text-xs font-semibold py-1.5"
								onClick={handleDecompose}
								disabled={isDecomposing}
								leftIcon={isDecomposing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} className="text-amber-500" />}
							>
								{isDecomposing ? "Running AI..." : "Decompose Task"}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</BaseModal>
	);
};

export default TaskDetailModal;
;
