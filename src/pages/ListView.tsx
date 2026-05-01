import React, { useState, useEffect } from "react";
import PageHeader from "../components/molecules/PageHeader";
import TimelineView from "../components/organisms/TimelineView";
import Button from "../components/atoms/Button";
import TaskFormModal from "../components/organisms/TaskFormModal";
import { Download, Filter, Plus } from "lucide-react";
import { projectService } from "../services/projectService";
import { useToast } from "../hooks/useToast";
import type { Project, Task } from "../types";

const ListView: React.FC = () => {
	const { success } = useToast();
	const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
	const [projects, setProjects] = useState<Project[]>([]);

	useEffect(() => {
		projectService.getProjects().then(setProjects);
	}, []);

	const handleCreateTask = async (data: Partial<Task>) => {
		await projectService.createTask(data);
		success("Milestone Planned", `Entry "${data.title}" has been added to the backlog.`);
		setIsTaskModalOpen(false);
	};

	return (
		<div className="h-full flex flex-col space-y-6 pb-10 overflow-hidden">
			<TaskFormModal
				isOpen={isTaskModalOpen}
				onClose={() => setIsTaskModalOpen(false)}
				onSave={handleCreateTask}
				projects={projects}
			/>
			<PageHeader
				title="Project Timeline"
				description="Visualize task distribution and delivery milestones across the project lifecycle."
				actions={
					<div className="flex items-center gap-3">
						<Button variant="secondary" leftIcon={<Filter size={16} />}>
							Filter
						</Button>
						<Button variant="secondary" leftIcon={<Download size={16} />}>
							Export
						</Button>
						<Button 
							leftIcon={<Plus size={16} />}
							onClick={() => setIsTaskModalOpen(true)}
						>
							Plan Milestone
						</Button>
					</div>
				}
			/>

			<div className="flex-1 min-h-0">
				<TimelineView />
			</div>
		</div>
	);
};

export default ListView;
