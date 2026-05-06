import React, { useEffect } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 5000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const icons = {
    success: <CheckCircle className="text-primary" size={20} />,
    error: <AlertCircle className="text-primary" size={20} />,
    warning: <AlertTriangle className="text-primary" size={20} />,
    info: <Info className="text-primary" size={20} />,
  };

  const borders = {
    success: 'border-emerald-500/20',
    error: 'border-rose-500/20',
    warning: 'border-primary/20',
    info: 'border-primary/20',
  };

  const backgrounds = {
    success: 'bg-primary/5',
    error: 'bg-primary/5',
    warning: 'bg-primary/5',
    info: 'bg-primary/5',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={twMerge(
        "pointer-events-auto flex items-start gap-4 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl min-w-[320px] max-w-md group",
        borders[toast.type],
        backgrounds[toast.type],
        "glass-panel"
      )}
    >
      <div className="flex-shrink-0 mt-0.5">
        {icons[toast.type]}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">{toast.title}</h4>
        {toast.message && <p className="text-xs text-text-muted leading-relaxed">{toast.message}</p>}
      </div>
      <button 
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-[var(--card-bg)] text-text-muted hover:text-[var(--text-primary)] transition-all"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export default Toast;
