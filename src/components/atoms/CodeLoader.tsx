import React, { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CodeLoader: React.FC<CodeLoaderProps> = ({ size = 'md', className }) => {
  const symbols = ['{ }', '</>', '[ ]', '=>', '&&', '||', '!=', '++'];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % symbols.length);
    }, 1500);
    return () => clearInterval(timer);
  }, [symbols.length]);
  
  const sizeClasses = {
    sm: 'text-xs w-12 h-12',
    md: 'text-sm w-20 h-20',
    lg: 'text-2xl w-32 h-32',
  };

  return (
    <div className={twMerge('relative flex items-center justify-center', sizeClasses[size], className)}>
      {/* Orbital Ring */}
      <div className="absolute inset-0 rounded-full border border-primary/20 border-t-primary animate-spin duration-[3s] linear" />
      
      {/* Glow Effect */}
      <div className="absolute inset-4 rounded-full bg-primary/10 blur-xl animate-pulse" />

      {/* Symbol Container */}
      <div className="relative font-mono font-bold text-primary w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: 10, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 0.5, 
              ease: [0.23, 1, 0.32, 1] 
            }}
            className="drop-shadow-[0_0_12px_rgba(var(--primary-rgb),0.6)]"
          >
            {symbols[index]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CodeLoader;
