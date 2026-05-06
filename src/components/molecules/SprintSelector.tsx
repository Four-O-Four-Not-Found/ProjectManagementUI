import React from 'react';
import { Calendar, ChevronDown, Zap } from 'lucide-react';
import type { Sprint } from '../../types';

interface SprintSelectorProps {
  activeSprint?: Sprint;
  onSelectSprint?: (sprintId: string) => void;
}

const SprintSelector: React.FC<SprintSelectorProps> = ({ activeSprint }) => {
  if (!activeSprint) return null;

  const completed = activeSprint.completedTasks || 0;
  const total = activeSprint.taskCount || 1; // Avoid division by zero
  const progress = (completed / total) * 100;

  return (
    <div className="flex items-center gap-4 bg-surface border border-border rounded-md px-3 py-2 hover:bg-[var(--accent-primary)]/10 transition-colors cursor-pointer group">
      <div className="w-8 h-8 rounded bg-merged/10 flex items-center justify-center text-merged">
        <Zap size={16} />
      </div>
      
      <div className="flex-1 min-w-[140px]">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-xs font-bold text-text-main leading-none">
            {activeSprint.name}
          </h4>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-success/10 text-success border border-success/20 font-bold uppercase tracking-wider">
            {activeSprint.status}
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-[10px] text-text-muted font-medium">
          <div className="flex items-center gap-1">
            <Calendar size={10} />
            <span>Oct 14</span>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <div className="h-1 bg-background border border-border rounded-full flex-1 overflow-hidden">
              <div 
                className="h-full bg-success" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <span className="font-mono text-[9px]">{completed}/{activeSprint.taskCount || 0}</span>
          </div>
        </div>
      </div>

      <ChevronDown size={14} className="text-text-muted" />
    </div>
  );
};

export default SprintSelector;
