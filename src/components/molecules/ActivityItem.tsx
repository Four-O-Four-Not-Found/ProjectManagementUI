import React from 'react';
import Avatar from '../atoms/Avatar';
import type { Activity } from '../../types';
import { twMerge } from 'tailwind-merge';

interface ActivityItemProps {
  activity: Activity;
  className?: string;
  compact?: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, className, compact }) => {
  return (
    <div className={twMerge("flex gap-4 group cursor-pointer", className)}>
      <div className="relative">
        <Avatar name={activity.userName} size={compact ? "xs" : "md"} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <p className={twMerge(
            "text-slate-200 leading-snug",
            compact ? "text-[13px]" : "text-sm"
          )}>
            <span className="font-bold text-white">{activity.userName}</span> {activity.action} <span className="text-primary">{activity.target}</span>
          </p>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">{activity.timestamp}</span>
        </div>
        {activity.type === 'comment' && (
          <div className="bg-white/[0.02] p-4 rounded-2xl rounded-tl-none border border-white/[0.05] text-sm text-slate-300 mt-2">
            This is a mock comment content for {activity.target}.
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityItem;
