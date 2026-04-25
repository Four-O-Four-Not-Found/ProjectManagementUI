import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  colorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, trend, colorClass }) => {
  return (
    <div className="bg-surface border border-border rounded-md p-4 flex flex-col justify-between hover:border-text-muted transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <div className={twMerge(
          "w-10 h-10 rounded-md flex items-center justify-center text-white shadow-sm",
          colorClass || "bg-primary"
        )}>
          <Icon size={20} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-success bg-success/10 px-2 py-0.5 rounded-full text-[10px] font-bold border border-success/20">
            <TrendingUp size={10} />
            {trend}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-text-main group-hover:text-primary transition-colors">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
