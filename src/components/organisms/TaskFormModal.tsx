import React, { useState } from 'react';
import BaseModal from '../molecules/BaseModal';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import { Target } from 'lucide-react';
import type { Task, TaskType, Priority } from '../../types';
import { MOCK_PROJECTS } from '../../mocks/data';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  task?: Task | null;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, onSave, task }) => {
  const [formData, setFormData] = useState<Partial<Task>>(
    task || {
      title: '',
      description: '',
      type: 'Feature',
      priority: 'Medium',
      projectId: '',
      status: 'Todo'
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.projectId) newErrors.projectId = 'A project must be selected';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Modify Entry' : 'Create New Entry'}
      size="md"
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>{task ? 'Update' : 'Dispatch'}</Button>
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

        {/* Project Selection - MANDATORY */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-main block ml-0.5">Workspace Destination</label>
          <div className="relative">
            <Target size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <select 
              className={`w-full bg-background border ${errors.projectId ? 'border-danger' : 'border-border'} rounded-md py-2 pl-10 pr-4 text-sm text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer transition-all`}
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            >
              <option value="" disabled>Select a project...</option>
              {MOCK_PROJECTS.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.key})</option>
              ))}
            </select>
          </div>
          {errors.projectId && <p className="text-[10px] font-bold text-danger ml-1">{errors.projectId}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-main block ml-0.5">Classification</label>
            <div className="flex gap-2">
              {(['Feature', 'Bug', 'Issue'] as TaskType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setFormData({ ...formData, type })}
                  className={`flex-1 py-2 px-3 rounded-md border text-[10px] font-bold uppercase tracking-wider transition-all ${
                    formData.type === type 
                    ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                    : 'border-border text-text-muted hover:border-text-muted bg-surface'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-main block ml-0.5">Priority</label>
            <div className="flex gap-2">
              {(['Low', 'Medium', 'High', 'Urgent'] as Priority[]).map((priority) => (
                <button
                  key={priority}
                  onClick={() => setFormData({ ...formData, priority })}
                  className={`flex-1 py-2 px-2 rounded-md border text-[9px] font-bold uppercase tracking-tight transition-all ${
                    formData.priority === priority 
                    ? 'bg-merged/10 border-merged text-merged shadow-sm' 
                    : 'border-border text-text-muted hover:border-text-muted bg-surface'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-main block ml-0.5">Description</label>
          <textarea 
            className="w-full bg-background border border-border rounded-md p-3 text-sm text-text-main placeholder:text-text-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px] transition-all"
            placeholder="Describe the context or acceptance criteria..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default TaskFormModal;
