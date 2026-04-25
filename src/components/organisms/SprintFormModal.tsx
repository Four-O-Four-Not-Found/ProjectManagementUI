import React, { useState } from 'react';
import BaseModal from '../molecules/BaseModal';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { Calendar, Zap, Flag } from 'lucide-react';
import type { Sprint } from '../../types';

interface SprintFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Sprint>) => void;
}

const SprintFormModal: React.FC<SprintFormModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Sprint>>({
    name: '',
    startDate: '',
    endDate: '',
    status: 'Future'
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
      title="Plan New Sprint"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} leftIcon={<Zap size={16} />}>Launch Sprint</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input 
          label="Sprint Name"
          placeholder="e.g. Q2 Architecture Cleanup"
          icon={<Flag size={16} />}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-6">
          <Input 
            label="Start Date"
            type="date"
            icon={<Calendar size={16} />}
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
          <Input 
            label="End Date"
            type="date"
            icon={<Calendar size={16} />}
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>

        <div className="p-4 bg-background border border-border rounded-xl">
          <p className="text-xs text-text-muted mb-2 font-bold uppercase tracking-widest">Sprint Velocity (Estimated)</p>
          <p className="text-sm text-text-main">Launching this sprint will notify all assigned contributors and activate the board view.</p>
        </div>
      </form>
    </BaseModal>
  );
};

export default SprintFormModal;
