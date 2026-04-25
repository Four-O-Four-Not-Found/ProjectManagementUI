import { createContext } from 'react';

export interface ThemeContextType {
  theme: 'dark';
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
