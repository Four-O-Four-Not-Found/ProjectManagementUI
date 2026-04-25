import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, MessageSquare, AlertCircle } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

import NotificationItem from '../molecules/NotificationItem';

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const notifications = [
    { id: '1', title: 'Mentioned you in WEB-42', description: "I've updated the SignalR handlers, please check.", type: 'mention', time: '2m ago', icon: MessageSquare },
    { id: '2', title: 'Webhook Delivery Failed', description: 'GitHub reported a 401 Unauthorized for WEB-43.', type: 'error', time: '15m ago', icon: AlertCircle },
    { id: '3', title: 'Task Assigned', description: 'You have been assigned to WEB-46.', type: 'info', time: '1h ago', icon: Bell },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[150]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md glass-panel z-[151] border-l border-white/[0.1] flex flex-col shadow-2xl shadow-black/50"
          >
            <div className="p-6 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-white">Notifications</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/[0.05] text-slate-400 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-custom">
              {notifications.map((notif) => (
                <NotificationItem key={notif.id} notification={notif} />
              ))}
            </div>

            <div className="p-4 border-t border-white/[0.05] bg-white/[0.01]">
               <button className="w-full py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-sm font-bold text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all">
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
