import React, { useState } from 'react';
import BaseModal from '../molecules/BaseModal';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { Target, Hash } from 'lucide-react';
import type { Project } from '../../types';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Project>) => void;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    key: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Initialize New Project"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Workspace</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Input 
              label="Project Name"
              placeholder="e.g. Orion Infrastructure"
              icon={<Target size={16} />}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <Input 
            label="Key"
            placeholder="e.g. ORN"
            icon={<Hash size={16} />}
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted uppercase tracking-widest block ml-1">Workspace Description</label>
          <textarea 
            className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 text-sm text-main outline-none focus:border-primary/50 transition-all min-h-[100px] resize-none"
            placeholder="What is the mission of this project?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      </form>
    </BaseModal>
  );
};

export default ProjectFormModal;
