import React from 'react';
import { twMerge } from 'tailwind-merge';

interface NotificationItemProps {
  notification: {
    id: string;
    title: string;
    description: string;
    type: string;
    time: string;
    icon: React.ElementType;
  };
  onClick?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all cursor-pointer group"
    >
      <div className="flex gap-4">
        <div className={twMerge(
          "w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.05]",
          notification.type === 'error' ? 'bg-rose-500/10 text-rose-400' : 
          notification.type === 'mention' ? 'bg-primary/10 text-primary' : 'bg-slate-800 text-slate-400'
        )}>
          <notification.icon size={18} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{notification.title}</h3>
            <span className="text-[10px] text-slate-500 uppercase font-bold">{notification.time}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{notification.description}</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
