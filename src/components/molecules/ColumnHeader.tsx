import React from 'react';
import { Plus } from 'lucide-react';

interface ColumnHeaderProps {
  title: string;
  colorClass: string;
  count: number;
  onAdd?: () => void;
}

const ColumnHeader: React.FC<ColumnHeaderProps> = ({ 
  title, 
  colorClass, 
  count, 
  onAdd 
}) => {
  return (
    <div className={`flex items-center justify-between mb-4 px-2 border-l-4 ${colorClass} h-8`}>
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-slate-200 text-sm uppercase tracking-widest">
          {title}
        </h3>
        <span className="text-xs bg-white/[0.05] px-2 py-0.5 rounded-full text-slate-500 font-bold">
          {count}
        </span>
      </div>
      <button 
        onClick={onAdd}
        className="p-1 rounded hover:bg-white/[0.05] text-slate-500 transition-all"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default ColumnHeader;
