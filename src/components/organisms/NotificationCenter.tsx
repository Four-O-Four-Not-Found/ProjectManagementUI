import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

import NotificationItem from '../molecules/NotificationItem';
import { useNotificationStore } from '../../store/useNotificationStore';
import { Loader2, Inbox } from 'lucide-react';

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { notifications, loading, fetchNotifications, markAllAsRead, markAsRead } = useNotificationStore();

  React.useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[15000]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md glass-panel z-[15001] border-l border-[var(--card-border)] flex flex-col shadow-2xl shadow-black/50"
          >
            <div className="p-6 border-b border-[var(--card-border)] flex items-center justify-between bg-[var(--card-bg)]">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Notifications</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-[var(--card-bg)] text-slate-400 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-custom">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 className="animate-spin text-primary" size={32} />
                  <p className="text-sm text-slate-500 font-mono">Syncing inbox...</p>
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notif) => (
                  <NotificationItem 
                    key={notif.id} 
                    notification={notif} 
                    onClick={() => markAsRead(notif.id)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-50">
                  <Inbox size={48} className="text-slate-600" />
                  <p className="text-sm text-slate-500">Your inbox is clear.</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[var(--card-border)] bg-[var(--card-bg)] space-y-3">
               {Notification.permission !== 'granted' && (
                 <button 
                  onClick={async () => {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                      console.log('Notification permission granted.');
                      // In a real app, you would now send the push subscription to the server
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
                 >
                   <Bell size={14} />
                   Enable Background Alerts
                 </button>
               )}
               <button 
                onClick={markAllAsRead}
                className="w-full py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-sm font-bold text-slate-300 hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)] transition-all"
               >
                 Mark all as read
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;
