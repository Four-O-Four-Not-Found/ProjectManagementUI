import React from 'react';
import { type LucideIcon, TrendingUp } from 'lucide-react';
import GlassCard from './GlassCard';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string;
  trend?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  icon: Icon, 
  colorClass, 
  trend,
  className 
}) => (
  <GlassCard className={className}>
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-3xl opacity-20 ${colorClass}`}></div>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] ${colorClass.replace('bg-', 'text-')}`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex items-center gap-1">
          <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
    <p className="text-slate-400 text-sm mb-1">{label}</p>
    <h3 className="text-3xl font-bold text-white">{value}</h3>
  </GlassCard>
);

export default StatCard;
