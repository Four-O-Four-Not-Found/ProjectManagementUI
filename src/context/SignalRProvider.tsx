import React, { useEffect } from 'react';
import { signalRService } from '../services/signalRService';
import { useToast } from '../hooks/useToast';
import { SignalRContext } from './SignalRContext';
import { useNotificationStore } from '../store/useNotificationStore';
import { type Notification } from '../services/notificationService';

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { info, success } = useToast();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    const init = async () => {
      await signalRService.startConnection();
      
      // Setup global listeners with type safety
      signalRService.on('ReceiveNotification', (data) => {
        const notification = data as Notification;
        addNotification(notification);
        success(notification.title, notification.message);
      });

      signalRService.on('TaskUpdated', (data) => {
        const payload = data as { taskId: string };
        if (payload?.taskId) {
          info('Live Sync', `Task ${payload.taskId} was updated by another user.`);
        }
      });

      signalRService.on('UserJoined', (data) => {
        const payload = data as { userName: string };
        if (payload?.userName) {
          info('Collaboration', `${payload.userName} joined the workspace.`);
        }
      });
    };

    init();

    return () => {
      signalRService.stopConnection();
    };
  }, [info, success, addNotification]);

  return (
    <SignalRContext.Provider value={{ service: signalRService }}>
      {children}
    </SignalRContext.Provider>
  );
};
