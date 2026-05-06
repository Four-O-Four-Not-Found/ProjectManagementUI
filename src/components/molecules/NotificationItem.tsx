import React from 'react';
import { twMerge } from 'tailwind-merge';
import { type Notification } from '../../services/notificationService';
import { Bell, MessageSquare, AlertCircle, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
  const Icon = ({
    TaskAssigned: Bell,
    Mention: MessageSquare,
    System: AlertCircle,
    General: Info,
  })[notification.type] || Info;

  return (
    <div 
      onClick={onClick}
      className={twMerge(
        "p-4 rounded-2xl border transition-all cursor-pointer group relative",
        notification.isRead 
          ? "bg-[var(--card-bg)] border-[var(--card-border)] opacity-60 hover:opacity-100" 
          : "bg-[var(--card-bg)] border-[var(--card-border)] hover:bg-[var(--card-bg)] shadow-lg shadow-black/20"
      )}
    >
      {!notification.isRead && (
        <span className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(56,189,248,0.5)]"></span>
      )}
      <div className="flex gap-4">
        <div className={twMerge(
          "w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--card-border)]",
          notification.type === 'System' ? 'bg-rose-500/10 text-rose-400' : 
          notification.type === 'Mention' ? 'bg-primary/10 text-primary' : 
          notification.type === 'TaskAssigned' ? 'bg-accent-purple/10 text-accent-purple' :
          'bg-slate-800 text-slate-400'
        )}>
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-primary transition-colors pr-6">{notification.title}</h3>
            <span className="text-[9px] text-slate-500 uppercase font-bold shrink-0">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{notification.message}</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
