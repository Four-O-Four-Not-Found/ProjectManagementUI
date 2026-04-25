import React, { useEffect } from 'react';
import { signalRService } from '../services/signalRService';
import { useToast } from '../hooks/useToast';
import { SignalRContext } from './SignalRContext';

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { info } = useToast();

  useEffect(() => {
    const init = async () => {
      await signalRService.startConnection();
      
      // Setup global listeners with type safety
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
  }, [info]);

  return (
    <SignalRContext.Provider value={{ service: signalRService }}>
      {children}
    </SignalRContext.Provider>
  );
};
