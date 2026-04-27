import React from 'react';
import { twMerge } from 'tailwind-merge';

interface PageHeaderProps {
  title: React.ReactNode;
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
      <div className="flex-1 min-w-0">
        <div className="text-3xl md:text-4xl font-bold text-text-main mb-2 truncate">
          {typeof title === 'string' ? <h1>{title}</h1> : title}
        </div>
        {description && <div className="text-text-muted text-sm md:text-base leading-relaxed">{description}</div>}
      </div>
      {actions && (
        <div className="flex gap-3 w-full md:w-auto shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
