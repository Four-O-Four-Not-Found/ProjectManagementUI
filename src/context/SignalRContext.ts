import { createContext } from 'react';
import { signalRService } from '../services/signalRService';

export interface SignalRContextType {
  service: typeof signalRService;
}

export const SignalRContext = createContext<SignalRContextType | undefined>(undefined);
