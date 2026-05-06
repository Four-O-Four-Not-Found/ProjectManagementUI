import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center w-12 h-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full p-1 cursor-pointer hover:border-[var(--card-border)] transition-all group"
      aria-label="Toggle Theme"
    >
      <motion.div
        animate={{ x: theme === 'dark' ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-[0_0_8px_rgba(255,255,255,0.4)]"
      >
        {theme === 'dark' ? (
          <Moon size={10} className="text-text-main" />
        ) : (
          <Sun size={10} className="text-primary" />
        )}
      </motion.div>
      
      <div className="absolute inset-0 flex justify-between items-center px-2 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
        <Sun size={10} className={theme === 'light' ? 'text-primary' : 'text-text-muted'} />
        <Moon size={10} className={theme === 'dark' ? 'text-[var(--text-primary)]' : 'text-text-muted'} />
      </div>
    </button>
  );
};

export default ThemeToggle;
