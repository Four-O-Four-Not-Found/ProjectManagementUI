import React from 'react';
import { twMerge } from 'tailwind-merge';

interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  actions,
  className 
}) => {
  return (
    <div className={twMerge("flex flex-col md:flex-row justify-between items-start md:items-end gap-6", className)}>
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h1>
        {description && <p className="text-slate-400 text-sm md:text-base">{description}</p>}
      </div>
      {actions && (
        <div className="flex gap-3 w-full md:w-auto">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
