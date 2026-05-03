import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
	Send,
	Plus,
	User,
	Calendar,
	Sparkles,
	Wand2,
	Loader2,
	Edit2,
	Check,
	X,
	Trash2,
	MessageSquare,
	AlertCircle,
	Lightbulb,
	CheckCircle2,
	Bookmark,
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

const TypeIcon = ({ type }: { type: Task["type"] }) => {
	switch (type) {
		case "Issue":
			return <AlertCircle size={12} className="text-gray-500" />;
		case "Suggestion":
			return <Lightbulb size={12} className="text-gray-400" />;
		case "Bug":
			return <AlertCircle size={12} className="text-gray-600 font-bold" />;
		case "Feature":
			return <CheckCircle2 size={12} className="text-gray-900" />;
		default:
			return <Bookmark size={12} className="text-gray-900" />;
	}
};

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
			<div className="space-y-1.5">
				<div className="flex items-center gap-3">
					<span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded border border-gray-200 dark:border-white/10">
						{task.taskKey}
					</span>
					<div className="flex items-center gap-1.5">
						<TypeIcon type={task.type} />
						<span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
							{task.type}
						</span>
					</div>
				</div>
				{isEditing ? (
					<input
						value={editedTitle}
						onChange={(e) => setEditedTitle(e.target.value)}
						className="text-xl font-bold text-gray-900 dark:text-white bg-transparent border-b border-gray-200 dark:border-white/10 py-1 outline-none focus:border-gray-900 dark:focus:border-white w-full max-w-lg transition-colors"
						autoFocus
					/>
				) : (
					<h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
						{task.title}
					</h2>
				)}
			</div>
 
			<div className="flex items-center gap-3">
				{isEditing ? (
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							variant="secondary"
							onClick={() => {
								setIsEditing(false);
								setEditedTitle(task.title);
								setEditedDescription(task.description);
							}}
						>
							<X size={16} />
						</Button>
						<Button
							size="sm"
							variant="primary"
							loading={isSaving}
							onClick={handleUpdateTask}
							leftIcon={<Check size={16} />}
						>
							Save Changes
						</Button>
					</div>
				) : (
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							variant="secondary"
							onClick={() => setIsEditing(true)}
							leftIcon={<Edit2 size={14} />}
						>
							Edit
						</Button>
						<Button
							size="sm"
							variant="secondary"
							className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
							onClick={handleDeleteTask}
							loading={isSaving}
						>
							<Trash2 size={14} />
						</Button>
					</div>
				)}
			</div>
		</div>
	);
 
	return (
		<BaseModal isOpen={isOpen} onClose={onClose} title={modalHeader} size="xl">
			<div className="flex flex-col md:flex-row min-h-[600px] bg-white dark:bg-gray-950">
				{/* Left Content */}
				<div className="flex-1 p-6 md:p-10">
					<div className="flex gap-8 border-b border-gray-100 dark:border-white/5 mb-8">
						{(["details", "activity", "attachments"] as const).map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`pb-4 text-xs font-semibold uppercase tracking-widest transition-all relative ${
									activeTab === tab
										? "text-gray-900 dark:text-white"
										: "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
								}`}
							>
								{tab === "details" ? "Details" : tab === "activity" ? "Discussion" : "Files"}
								{activeTab === tab && (
									<motion.div
										layoutId="activeTabDetail"
										className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900 dark:bg-white"
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
 
				{/* Sidebar Details */}
				<div className="w-full md:w-80 bg-gray-50/50 dark:bg-white/2 border-l border-gray-100 dark:border-white/5 p-6 md:p-10 space-y-10">
					<div>
						<h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-5">
							AI Assistance
						</h3>
						<Button
							variant="secondary"
							size="sm"
							className="w-full justify-start py-2.5 px-4 bg-white dark:bg-gray-900 border-gray-200 dark:border-white/10 shadow-sm"
							onClick={handleDecompose}
							disabled={isDecomposing}
							leftIcon={
								isDecomposing ? (
									<Loader2 size={16} className="animate-spin" />
								) : (
									<Sparkles size={16} className="text-amber-500" />
								)
							}
						>
							<span className="text-xs font-semibold">{isDecomposing ? "Decomposing..." : "AI Breakdown"}</span>
						</Button>
					</div>
 
					<div className="space-y-8">
						<div className="space-y-4">
							<h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
								Properties
							</h3>
							<div className="space-y-3">
								<div className="flex items-center justify-between text-xs">
									<span className="text-gray-500">Status</span>
									<Badge variant="primary" size="xs">
										{task.status}
									</Badge>
								</div>
								<div className="flex items-center justify-between text-xs">
									<span className="text-gray-500">Priority</span>
									<Badge
										variant={task.priority === "Urgent" ? "danger" : task.priority === "High" ? "warning" : "secondary"}
										size="xs"
									>
										{task.priority}
									</Badge>
								</div>
								<div className="flex items-center justify-between text-xs">
									<span className="text-gray-500">Type</span>
									<div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white">
										<TypeIcon type={task.type} />
										{task.type}
									</div>
								</div>
							</div>
						</div>
 
						<div className="space-y-4">
							<h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
								Assignees
							</h3>
							<div className="space-y-3">
								{task.taskAssignees && task.taskAssignees.length > 0 ? (
									<div className="space-y-2">
										{task.taskAssignees
											.map((ta) => (
												<div
													key={ta.id || ta.userId}
													className="flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm"
												>
													<Avatar
														name={ta.user?.displayName || "Unknown User"}
														src={ta.user?.avatarUrl}
														size="xs"
													/>
													<div className="min-w-0">
														<p className="text-[12px] font-bold text-gray-900 dark:text-white truncate">
															{ta.user?.displayName || "Loading collaborator..."}
														</p>
														<p className="text-[10px] text-gray-400 font-medium">
															Collaborator
														</p>
													</div>
												</div>
											))}
									</div>
								) : (
									<div className="flex items-center gap-3 bg-gray-100/50 dark:bg-white/2 p-3 rounded-xl border border-dashed border-gray-300 dark:border-white/10">
										<div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400">
											<User size={16} />
										</div>
										<p className="text-[11px] font-bold text-gray-400 italic">
											Pick up this task
										</p>
									</div>
								)}
 
								{user &&
									!task.taskAssignees?.some((ta) => ta.user?.id === user.id) && (
										<Button
											size="sm"
											className="w-full py-2.5 rounded-xl shadow-md"
											variant="primary"
											onClick={() => onAssign?.(task.id, user.id)}
										>
											{task.taskAssignees?.length
												? "Join Collaboration"
												: "Volunteer Now"}
										</Button>
									)}
							</div>
						</div>
 
						<div className="space-y-4">
							<h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
								Timeline
							</h3>
							{task.dueDate ? (
								<div
									className={`flex items-center gap-4 p-4 rounded-2xl border ${new Date(task.dueDate) < new Date() && task.status !== "Closed" ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/5 dark:border-red-500/20 dark:text-red-400" : "bg-white dark:bg-gray-900 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 shadow-sm"}`}
								>
									<Calendar size={18} className="shrink-0" />
									<div className="min-w-0">
										<p className="text-[12px] font-bold">
											{new Date(task.dueDate).toLocaleDateString(undefined, {
												month: "short",
												day: "numeric",
												year: "numeric",
											})}
										</p>
										<p className="text-[10px] font-medium opacity-60">
											{new Date(task.dueDate) < new Date() &&
											task.status !== "Closed"
												? "Overdue"
												: "Target Date"}
										</p>
									</div>
								</div>
							) : (
								<p className="text-[11px] text-gray-400 italic font-medium">
									No deadline set.
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</BaseModal>
	);
};

export default TaskDetailModal;
