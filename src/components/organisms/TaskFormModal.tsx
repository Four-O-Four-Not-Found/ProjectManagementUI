import React, { useState } from "react";
import BaseModal from "../molecules/BaseModal";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import {
	Target,
	GitBranch,
	Plus,
	User,
	Image as ImageIcon,
	X,
	Calendar,
} from "lucide-react";
import type {
	Task,
	TaskType,
	Priority,
	Project,
	Attachment,
} from "../../types";
import { projectService } from "../../services/projectService";
import teamService from "../../services/teamService";
import type { TeamMember } from "../../services/teamService";
import { githubService } from "../../services/githubService";
import type { GitHubBranch } from "../../services/githubService";
import type { Repository } from "../../types";

interface TaskFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (task: Partial<Task>) => void;
	task?: Task | null;
	defaultProjectId?: string;
	projects?: Project[];
	teamMembers?: TeamMember[];
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({
	isOpen,
	onClose,
	onSave,
	task,
	defaultProjectId,
	projects = [],
	teamMembers = [],
}) => {
	const [formData, setFormData] = useState<Partial<Task>>(
		task || {
			title: "",
			description: "",
			type: "Feature",
			priority: "Medium",
			projectId: defaultProjectId || "",
			assigneeId: "",
			status: "New",
			dueDate: "",
		},
	);

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [branches, setBranches] = useState<GitHubBranch[]>([]);
	const [localTeamMembers, setLocalTeamMembers] =
		useState<TeamMember[]>(teamMembers);

	const [hasProjectChanged, setHasProjectChanged] = useState(false);
	const displayedMembers = hasProjectChanged ? localTeamMembers : teamMembers;
	const [isCreatingBranch, setIsCreatingBranch] = useState(false);
	const [isFetchingBranches, setIsFetchingBranches] = useState(false);
	const [newBranchName, setNewBranchName] = useState("");
	const [baseBranch, setBaseBranch] = useState("main");
	const [isSaving, setIsSaving] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [repositories, setRepositories] = useState<Repository[]>([]);

	const [currentRepo, setCurrentRepo] = useState<Repository | undefined>(
		undefined,
	);

	const handleProjectChange = React.useCallback(
		(projectId: string) => {
			setFormData((prev) => ({ ...prev, projectId }));
			setHasProjectChanged(true);

			if (projectId) {
				const project = projects.find((p) => p.id === projectId);
				if (project?.teamId) {
					teamService
						.getTeam(project.teamId)
						.then((team) => setLocalTeamMembers(team.members || []))
						.catch(console.error);
				}

				projectService
					.getRepositories(projectId)
					.then((repos) => {
						setRepositories(repos);
						if (repos.length > 0) {
							const defaultRepo = repos[0];
							setCurrentRepo(defaultRepo);
							setFormData((prev) => ({
								...prev,
								repositoryId: defaultRepo.id,
							}));

							setIsFetchingBranches(true);
							const parts = defaultRepo.repoName.split("/");
							if (parts.length === 2) {
								githubService
									.getBranches(parts[0], parts[1])
									.then((data) => {
										setBranches(data);
										if (
											data.length > 0 &&
											!data.find((b) => b.name === "main")
										) {
											setBaseBranch(data[0].name);
										} else if (data.find((b) => b.name === "main")) {
											setBaseBranch("main");
										}
									})
									.catch(console.error)
									.finally(() => setIsFetchingBranches(false));
							} else {
								setIsFetchingBranches(false);
							}
						} else {
							setCurrentRepo(undefined);
							setBranches([]);
						}
					})
					.catch(console.error);
			}
		},
		[projects],
	);

	const handleRepositoryChange = (repoId: string) => {
		const repo = repositories.find((r) => r.id === repoId);
		if (!repo) return;

		setCurrentRepo(repo);
		setFormData((prev) => ({ ...prev, repositoryId: repoId }));

		setIsFetchingBranches(true);
		const parts = repo.repoName.split("/");
		if (parts.length === 2) {
			githubService
				.getBranches(parts[0], parts[1])
				.then((data) => {
					setBranches(data);
					if (data.length > 0 && !data.find((b) => b.name === "main")) {
						setBaseBranch(data[0].name);
					} else if (data.find((b) => b.name === "main")) {
						setBaseBranch("main");
					}
				})
				.catch(console.error)
				.finally(() => setIsFetchingBranches(false));
		} else {
			setIsFetchingBranches(false);
		}
	};

	React.useEffect(() => {
		if (defaultProjectId) {
			const timer = setTimeout(() => {
				handleProjectChange(defaultProjectId);
			}, 0);
			return () => clearTimeout(timer);
		}
	}, [defaultProjectId, handleProjectChange]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const validate = () => {
		const newErrors: Record<string, string> = {};
		if (!formData.title) newErrors.title = "Title is required";
		if (!formData.projectId) newErrors.projectId = "A project must be selected";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSave = async () => {
		if (validate()) {
			setIsSaving(true);
			try {
				let updatedFormData = { ...formData };

				if (updatedFormData.assigneeId === "") {
					updatedFormData.assigneeId = undefined;
				}

				if (imagePreview) {
					const newAttachment: Attachment = {
						id: Math.random().toString(36).substr(2, 9),
						url: imagePreview,
						name: "evidence.png",
						type: "image",
						size: "Unknown",
					};
					updatedFormData = {
						...updatedFormData,
						attachments: [
							...(updatedFormData.attachments || []),
							newAttachment,
						],
					};
				}
				if (isCreatingBranch && newBranchName && currentRepo) {
					const parts = currentRepo.repoName.split("/");
					if (parts.length === 2) {
						const branch = await githubService.createBranch(
							parts[0],
							parts[1],
							newBranchName,
							baseBranch,
						);
						updatedFormData = { ...updatedFormData, branchName: branch.name };
					}
				}
				onSave(updatedFormData);
			} catch (err) {
				console.error("Failed to create branch", err);
			} finally {
				setIsSaving(false);
			}
		}
	};

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title={task ? "Modify Entry" : "Create New Entry"}
			size="md"
			footer={
				<div className="flex gap-2">
					<Button variant="secondary" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={handleSave} isLoading={isSaving}>
						{task ? "Update" : "Dispatch"}
					</Button>
				</div>
			}
		>
			<div className="space-y-6">
				<Input
					label="Title"
					placeholder="What needs to be done?"
					value={formData.title}
					onChange={(e) => setFormData({ ...formData, title: e.target.value })}
					error={errors.title}
				/>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-1.5">
						<label className="text-xs font-semibold text-text-main block ml-0.5">
							Project Destination
						</label>
						<div className="relative">
							<Target
								size={16}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
							/>
							<select
								className={`w-full bg-background border ${errors.projectId ? "border-danger" : "border-border"} rounded-md py-2 pl-10 pr-4 text-sm text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer transition-all`}
								value={formData.projectId}
								onChange={(e) => handleProjectChange(e.target.value)}
							>
								<option value="" disabled>
									Select a project...
								</option>
								{projects.map((p) => (
									<option key={p.id} value={p.id}>
										{p.name} ({p.key})
									</option>
								))}
							</select>
						</div>
						{errors.projectId && (
							<p className="text-[10px] font-bold text-danger ml-1">
								{errors.projectId}
							</p>
						)}
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-semibold text-text-main block ml-0.5">
							Assignee
						</label>
						<div className="relative">
							<User
								size={16}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
							/>
							<select
								className="w-full bg-background border border-border rounded-md py-2 pl-10 pr-4 text-sm text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer transition-all"
								value={formData.assigneeId || ""}
								onChange={(e) =>
									setFormData({ ...formData, assigneeId: e.target.value })
								}
							>
								<option value="">Unassigned (Volunteer basis)</option>
								{displayedMembers.map((m) => (
									<option key={m.userId} value={m.userId}>
										{m.name}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-1.5">
						<label className="text-xs font-semibold text-text-main block ml-0.5">
							Deadline (Due Date)
						</label>
						<div className="relative">
							<Calendar
								size={16}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
							/>
							<input
								type="date"
								className="w-full bg-background border border-border rounded-md py-2 pl-10 pr-4 text-sm text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
								value={formData.dueDate ? formData.dueDate.split("T")[0] : ""}
								onChange={(e) =>
									setFormData({ ...formData, dueDate: e.target.value })
								}
							/>
						</div>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-semibold text-text-main block ml-0.5">
							Classification
						</label>
						<div className="flex gap-2">
							{(["Feature", "Bug", "Issue"] as TaskType[]).map((type) => (
								<button
									key={type}
									onClick={() => setFormData({ ...formData, type })}
									className={`flex-1 py-2 px-3 rounded-md border text-[10px] font-bold uppercase tracking-wider transition-all ${
										formData.type === type
											? "bg-primary/10 border-primary text-primary shadow-sm"
											: "border-border text-text-muted hover:border-text-muted bg-surface"
									}`}
								>
									{type}
								</button>
							))}
						</div>
					</div>
				</div>

				<div className="space-y-1.5">
					<label className="text-xs font-semibold text-text-main block ml-0.5">
						Context Evidence (Image)
					</label>
					<div className="flex items-center gap-4">
						{imagePreview ? (
							<div className="relative w-20 h-20 rounded-xl overflow-hidden border border-border group">
								<img
									src={imagePreview}
									alt="Preview"
									className="w-full h-full object-cover"
								/>
								<button
									onClick={() => setImagePreview(null)}
									className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
								>
									<X size={16} />
								</button>
							</div>
						) : (
							<label className="w-20 h-20 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group">
								<ImageIcon
									size={20}
									className="text-text-muted group-hover:text-primary transition-colors"
								/>
								<span className="text-[9px] font-bold text-text-muted uppercase group-hover:text-primary">
									Add
								</span>
								<input
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleImageChange}
								/>
							</label>
						)}
						<div className="flex-1">
							<p className="text-[10px] text-text-muted">
								Upload a screenshot or visual reference for this task. Maximum
								5MB.
							</p>
						</div>
					</div>
				</div>

				<div className="space-y-1.5">
					<label className="text-xs font-semibold text-text-main block ml-0.5">
						Priority Level
					</label>
					<div className="flex gap-2">
						{(["Low", "Medium", "High", "Urgent"] as Priority[]).map(
							(priority) => (
								<button
									key={priority}
									onClick={() => setFormData({ ...formData, priority })}
									className={`flex-1 py-2 px-2 rounded-md border text-[9px] font-bold uppercase tracking-tight transition-all ${
										formData.priority === priority
											? "bg-merged/10 border-merged text-merged shadow-sm"
											: "border-border text-text-muted hover:border-text-muted bg-surface"
									}`}
								>
									{priority}
								</button>
							),
						)}
					</div>
				</div>

				<div className="space-y-1.5">
					<label className="text-xs font-semibold text-text-main block ml-0.5">
						Description
					</label>
					<textarea
						className="w-full bg-background border border-border rounded-md p-3 text-sm text-text-main placeholder:text-text-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px] transition-all"
						placeholder="Describe the context or acceptance criteria..."
						value={formData.description}
						onChange={(e) =>
							setFormData({ ...formData, description: e.target.value })
						}
					/>
				</div>

				{repositories.length > 0 && (
					<div className="space-y-1.5">
						<label className="text-xs font-semibold text-text-main block ml-0.5">
							Target Repository
						</label>
						<div className="relative">
							<Target
								size={16}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
							/>
							<select
								className="w-full bg-background border border-border rounded-md py-2 pl-10 pr-4 text-sm text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer transition-all"
								value={formData.repositoryId || ""}
								onChange={(e) => handleRepositoryChange(e.target.value)}
							>
								{repositories.map((r) => (
									<option key={r.id} value={r.id}>
										{r.repoName}
									</option>
								))}
							</select>
						</div>
					</div>
				)}

				{currentRepo && (
					<div className="space-y-1.5">
						<div className="flex justify-between items-end mb-1">
							<label className="text-xs font-semibold text-text-main block ml-0.5">
								GitHub Branch{" "}
								{isFetchingBranches && (
									<span className="text-[10px] text-primary animate-pulse ml-2 font-normal">
										(Syncing...)
									</span>
								)}
							</label>
							<button
								type="button"
								onClick={() => setIsCreatingBranch(!isCreatingBranch)}
								className="text-[10px] text-primary hover:text-primary-hover font-bold flex items-center gap-1"
							>
								{isCreatingBranch ? (
									"Link Existing"
								) : (
									<>
										<Plus size={10} /> Create New
									</>
								)}
							</button>
						</div>

						{isCreatingBranch ? (
							<div className="space-y-3">
								<div className="relative">
									<GitBranch
										size={16}
										className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
									/>
									<input
										type="text"
										className="w-full bg-background border border-border rounded-md py-2 pl-10 pr-4 text-sm text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
										placeholder="e.g. feature/new-login"
										value={newBranchName}
										onChange={(e) => setNewBranchName(e.target.value)}
									/>
								</div>
								<div className="relative">
									<GitBranch
										size={14}
										className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted opacity-50"
									/>
									<select
										className="w-full bg-background/50 border border-border rounded-md py-1.5 pl-10 pr-4 text-xs text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer transition-all"
										value={baseBranch}
										onChange={(e) => setBaseBranch(e.target.value)}
									>
										{branches.map((b) => (
											<option key={b.name} value={b.name}>
												Branch out from: {b.name}
											</option>
										))}
									</select>
								</div>
							</div>
						) : (
							<div className="relative">
								<GitBranch
									size={16}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
								/>
								<select
									className="w-full bg-background border border-border rounded-md py-2 pl-10 pr-4 text-sm text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer transition-all"
									value={formData.branchName || ""}
									onChange={(e) =>
										setFormData({ ...formData, branchName: e.target.value })
									}
								>
									<option value="">No Branch Linked</option>
									{branches.map((b) => (
										<option key={b.name} value={b.name}>
											{b.name}
										</option>
									))}
								</select>
							</div>
						)}
						<p className="text-[10px] text-text-muted ml-1">
							{isCreatingBranch
								? `A new branch will be created from ${baseBranch}.`
								: "Select an existing branch to link."}
						</p>
					</div>
				)}
			</div>
		</BaseModal>
	);
};

export default TaskFormModal;
