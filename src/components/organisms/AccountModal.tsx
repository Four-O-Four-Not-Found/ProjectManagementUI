import React from 'react';
import BaseModal from '../molecules/BaseModal';
import Avatar from '../atoms/Avatar';
import Button from '../atoms/Button';
import { Mail, Shield, GitBranch, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Account Settings"
      size="sm"
      footer={
        <Button variant="danger" leftIcon={<LogOut size={16} />} onClick={logout}>
          Sign Out
        </Button>
      }
    >
      <div className="space-y-8">
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative group">
            <Avatar name={user.displayName} size="xl" className="w-24 h-24 border-4 border-border" />
            <button className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition-opacity text-xs font-bold text-text-main">
              Change
            </button>
          </div>
          <div className="text-center">
            <h4 className="text-xl font-bold text-text-main">{user.displayName}</h4>
            <p className="text-sm text-text-muted">{user.role}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-background border border-border rounded-xl">
            <Mail size={18} className="text-text-muted" />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-text-muted uppercase">Email Address</p>
              <p className="text-sm text-text-main">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-background border border-border rounded-xl">
            <Shield size={18} className="text-text-muted" />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-text-muted uppercase">System Role</p>
              <p className="text-sm text-text-main">{user.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-background border border-border rounded-xl">
            <GitBranch size={18} className="text-text-muted" />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-text-muted uppercase">GitHub Sync</p>
              <p className="text-sm text-text-main">@{user.githubId || 'Not connected'}</p>
            </div>
            <Button size="xs" variant="secondary">Sync</Button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default AccountModal;
