import React, { useState, useEffect } from 'react';
import BaseModal from '../molecules/BaseModal';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { Bookmark, AlertCircle, Lightbulb, User, Calendar } from 'lucide-react';
import type { Task, TaskType, Priority } from '../../types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  onSave: (data: Partial<Task>) => void;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, task, onSave }) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    type: 'Feature',
    priority: 'Medium',
    status: 'Todo'
  });

  // Using a key in the parent is better, but here we synchronize when the modal opens
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setFormData({ ...task });
      } else {
        setFormData({
          title: '',
          description: '',
          type: 'Feature',
          priority: 'Medium',
          status: 'Todo'
        });
      }
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Entry'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{task ? 'Save Changes' : 'Create Entry'}</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input 
          label="Entry Title"
          placeholder="e.g. Implement real-time hub"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted uppercase tracking-widest block ml-1">Description</label>
          <textarea 
            className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 text-sm text-main outline-none focus:border-primary/50 transition-all min-h-[120px] resize-none"
            placeholder="Describe the objective..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest block ml-1">Classification</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Feature', 'Issue', 'Suggestion', 'Bug'] as TaskType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-xs font-bold ${
                    formData.type === type 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'bg-white/[0.02] border-white/[0.05] text-muted hover:border-white/[0.1]'
                  }`}
                >
                  {type === 'Issue' && <AlertCircle size={14} />}
                  {type === 'Suggestion' && <Lightbulb size={14} />}
                  {type === 'Feature' && <Bookmark size={14} />}
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest block ml-1">Priority Level</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Low', 'Medium', 'High', 'Urgent'] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: p })}
                  className={`px-3 py-2.5 rounded-xl border transition-all text-xs font-bold ${
                    formData.priority === p 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'bg-white/[0.02] border-white/[0.05] text-muted hover:border-white/[0.1]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>
    </BaseModal>
  );
};

export default TaskFormModal;
