import React from 'react';
import { AlertTriangle, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import BaseModal from './BaseModal';
import Button from '../atoms/Button';

export type ConfirmType = 'danger' | 'warning' | 'info' | 'success';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmType;
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  isLoading = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertCircle className="text-primary" size={24} />;
      case 'warning':
        return <AlertTriangle className="text-primary" size={24} />;
      case 'success':
        return <CheckCircle2 className="text-primary" size={24} />;
      case 'info':
      default:
        return <Info className="text-primary" size={24} />;
    }
  };

  const getConfirmButtonVariant = (): 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' => {
    switch (type) {
      case 'danger':
        return 'danger';
      case 'warning':
        return 'primary';
      case 'success':
        return 'success';
      case 'info':
      default:
        return 'primary';
    }
  };

  const getConfirmButtonClass = () => {
     if (type === 'danger') return 'bg-rose-600 hover:bg-rose-700 border-rose-500/30 text-[var(--text-primary)]';
     if (type === 'warning') return 'bg-amber-600 hover:bg-amber-700 border-primary/30 text-[var(--text-primary)]';
     if (type === 'success') return 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500/30 text-[var(--text-primary)]';
     return '';
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      zIndex="z-[11000]"
      footer={
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 sm:flex-none"
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={getConfirmButtonVariant()}
            onClick={onConfirm}
            className={`flex-1 sm:flex-none ${getConfirmButtonClass()}`}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-2xl bg-surface border border-primary/30 shadow-inner flex-shrink-0`}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-sm text-text-muted leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </BaseModal>
  );
};

export default ConfirmDialog;
