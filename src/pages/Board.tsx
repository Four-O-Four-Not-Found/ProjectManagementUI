import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import TaskCard from "../components/molecules/TaskCard";
import TaskDetailModal from "../components/organisms/TaskDetailModal";
import TaskFormModal from "../components/organisms/TaskFormModal";
import ProjectFormModal from "../components/organisms/ProjectFormModal";
import Button from "../components/atoms/Button";
import Avatar from "../components/atoms/Avatar";
import PageHeader from "../components/molecules/PageHeader";
import ColumnHeader from "../components/molecules/ColumnHeader";
import SprintSelector from "../components/molecules/SprintSelector";
import type { Task, Sprint, Project } from "../types";
import { useProject } from "../hooks/useProject";
import { useToast } from "../hooks/useToast";

const columns = [
	{ id: "Todo", title: "To Do", color: "border-slate-500" },
	{ id: "InProgress", title: "In Progress", color: "border-primary" },
	{ id: "InReview", title: "In Review", color: "border-accent-purple" },
	{ id: "Done", title: "Done", color: "border-emerald-500" },
];

const mockSprint: Sprint = {
  id: 'sprint-1',
  name: 'Project Genesis - Q1 Burst',
  startDate: '2026-04-01',
  endDate: '2026-04-15',
  status: 'Active',
  taskCount: 24,
  completedTasks: 18,
};

const Board: React.FC = () => {
	const { tasks, loading, fetchTasks, moveTask } = useProject();
	const { success } = useToast();
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

	useEffect(() => {
		fetchTasks("1"); // Mock project ID
	}, [fetchTasks]);

	const handleMoveTask = async (taskId: string, newStatus: Task['status']) => {
		await moveTask(taskId, newStatus);
		success('Task Moved', `Task status updated to ${newStatus}.`);
	};

	const handleAddTask = () => {
    setEditingTask(null);
		setIsTaskModalOpen(true);
	};

  const handleSaveTask = () => {
    success('Action Successful', editingTask ? 'Task updated.' : 'New task created.');
    setIsTaskModalOpen(false);
  };

  const handleCreateProject = (data: Partial<Project>) => {
    success('Workspace Ready', `Project "${data.name}" has been initialized.`);
    setIsProjectModalOpen(false);
  };

	if (loading && tasks.length === 0) {
		return <div className="h-full flex items-center justify-center text-primary animate-pulse">Loading workspace...</div>;
	}

	return (
		<div className="h-full flex flex-col space-y-6 pb-10">
			<TaskDetailModal
				isOpen={!!selectedTask}
				onClose={() => setSelectedTask(null)}
				task={selectedTask || {} as Task}
			/>

      <TaskFormModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={editingTask}
        onSave={handleSaveTask}
      />

      <ProjectFormModal 
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleCreateProject}
      />

			<PageHeader
				title="Active Board"
				description="Collaborate and track progress in real-time"
				actions={
					<div className="flex items-center justify-between w-full md:w-auto gap-6">
            <SprintSelector activeSprint={mockSprint} />
            
						<div className="flex -space-x-3">
							{[1, 2, 3].map((i) => (
								<Avatar
									key={i}
									name={`Member ${i}`}
									size="sm"
									className="border-2 border-slate-900 hover:z-10 transition-all"
									isClickable
								/>
							))}
							<button 
                onClick={() => setIsProjectModalOpen(true)}
                className="w-8 h-8 rounded-full border-2 border-slate-900 bg-white/[0.05] flex items-center justify-center text-slate-400 hover:text-white transition-all"
                title="Initialize New Project"
              >
								<Plus size={16} />
							</button>
						</div>
						<Button onClick={handleAddTask} variant="primary" size="sm" leftIcon={<Plus size={18} />}>
							New Task
						</Button>
					</div>
				}
			/>

			<div className="flex-1 flex gap-6 overflow-x-auto pb-6 scrollbar-custom min-h-0">
				{columns.map((col) => (
					<div key={col.id} className="flex-shrink-0 w-80 flex flex-col">
						<ColumnHeader 
							title={col.title} 
							colorClass={col.color} 
							count={tasks.filter((t) => t.status === col.id).length} 
              onAdd={handleAddTask}
						/>

						<div className="flex-1 bg-white/[0.01] rounded-2xl p-2 min-h-0 overflow-y-auto scrollbar-custom space-y-1">
							<AnimatePresence>
								{tasks
									.filter((task) => task.status === col.id)
									.map((task) => (
										<TaskCard 
                      key={task.id} 
                      task={task} 
                      onClick={() => setSelectedTask(task)}
                      onMove={(newStatus) => handleMoveTask(task.id, newStatus)}
                    />
									))}
							</AnimatePresence>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Board;
