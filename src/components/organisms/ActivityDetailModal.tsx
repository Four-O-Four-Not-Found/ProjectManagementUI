import React from 'react';
import BaseModal from '../molecules/BaseModal';
import Avatar from '../atoms/Avatar';
import Badge from '../atoms/Badge';
import { Clock, ExternalLink, Activity as ActivityIcon } from 'lucide-react';
import type { Activity } from '../../types';

interface ActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
}

const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({ isOpen, onClose, activity }) => {
  if (!activity) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Activity Details"
      size="sm"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-[var(--accent-primary)]/10 rounded-md border border-primary/30">
          <Avatar name={activity.userId || "User"} size="md" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-text-main">System User</span>
              <Badge size="xs" variant="primary">Contributor</Badge>
            </div>
            <p className="text-xs text-text-muted">ID: {activity.userId}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
             <div className="mt-1 w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <ActivityIcon size={16} />
             </div>
             <div>
                <p className="text-sm font-medium text-text-main">
                  {activity.action} <span className="text-primary font-bold">{activity.target}</span>
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-text-muted">
                   <Clock size={10} />
                   <span>{new Date(activity.createdAt).toLocaleString()}</span>
                </div>
             </div>
          </div>

          <div className="p-4 bg-background border border-primary/30 rounded-md">
            <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Audit Trace</h4>
            <p className="text-xs text-text-main leading-relaxed">
              This action was synchronized via SignalR Hub. The status transition for <strong>{activity.target}</strong> was validated and persisted in the audit ledger.
            </p>
          </div>
        </div>

        <button className="w-full py-2.5 rounded-md border border-primary/30 bg-surface hover:bg-[var(--accent-primary)]/10 text-xs font-bold text-text-main flex items-center justify-center gap-2 transition-all">
          <ExternalLink size={14} />
          View Related Task
        </button>
      </div>
    </BaseModal>
  );
};

export default ActivityDetailModal;
