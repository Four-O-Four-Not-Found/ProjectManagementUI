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
    <div className="bg-surface border border-border rounded-xl p-3 flex items-center gap-4 hover:border-primary/50 transition-all group relative overflow-hidden">
      <div className={twMerge(
        "w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg",
        colorClass || "bg-primary"
      )}>
        <Icon size={18} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-tight truncate">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-xl font-bold text-text-main group-hover:text-primary transition-colors leading-none">{value}</h3>
          {trend && (
            <span className="text-[9px] font-bold text-success flex items-center">
              <TrendingUp size={8} className="mr-0.5" />
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
