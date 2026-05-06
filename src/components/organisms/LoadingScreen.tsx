import React from 'react';
import CodeLoader from '../atoms/CodeLoader';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[30000] animate-fade-in">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-primary/10 rounded-full blur-[100px] animate-pulse delay-700" />
      
      <div className="relative flex flex-col items-center gap-8">
        <CodeLoader size="lg" />
      </div>
    </div>
  );
};

export default LoadingScreen;
