import React from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  X
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ 
  type, 
  title, 
  children, 
  onClose,
  className 
}) => {
  const icons = {
    success: <CheckCircle className="text-emerald-400" size={18} />,
    error: <AlertCircle className="text-rose-400" size={18} />,
    warning: <AlertTriangle className="text-amber-400" size={18} />,
    info: <Info className="text-primary" size={18} />,
  };

  const variants = {
    success: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-200',
    error: 'border-rose-500/20 bg-rose-500/5 text-rose-200',
    warning: 'border-amber-500/20 bg-amber-500/5 text-amber-200',
    info: 'border-primary/20 bg-primary/5 text-slate-200',
  };

  return (
    <div className={twMerge(
      "flex gap-3 p-4 rounded-2xl border backdrop-blur-md animate-fade-in",
      variants[type],
      className
    )}>
      <div className="flex-shrink-0 mt-0.5">
        {icons[type]}
      </div>
      <div className="flex-1">
        {title && <h5 className="text-sm font-bold text-white mb-1">{title}</h5>}
        <div className="text-sm opacity-90 leading-relaxed">
          {children}
        </div>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/[0.05] transition-all self-start"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
