import React from 'react';
import { Calendar, ChevronDown, Rocket } from 'lucide-react';
import type { Sprint } from '../../types';

interface SprintSelectorProps {
  activeSprint?: Sprint;
  onSelectSprint?: (sprintId: string) => void;
}

const SprintSelector: React.FC<SprintSelectorProps> = ({ activeSprint }) => {
  if (!activeSprint) return null;

  const progress = (activeSprint.completedTasks / activeSprint.taskCount) * 100;

  return (
    <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.05] rounded-2xl px-4 py-2 hover:bg-white/[0.05] transition-all cursor-pointer group">
      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(56,189,248,0.2)]">
        <Rocket size={20} />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
            {activeSprint.name}
          </h4>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider">
            {activeSprint.status}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-[10px] text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar size={10} />
            <span>Ends in 4 days</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <span>{activeSprint.completedTasks}/{activeSprint.taskCount} Tasks</span>
          </div>
        </div>
      </div>

      <ChevronDown size={16} className="text-slate-600" />
    </div>
  );
};

export default SprintSelector;
