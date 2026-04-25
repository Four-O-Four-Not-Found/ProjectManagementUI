import React, { useMemo } from 'react';
import { format, addDays, startOfToday, differenceInDays, isSameDay } from 'date-fns';
import { MOCK_TASKS } from '../../mocks/data';
import Avatar from '../atoms/Avatar';
import Badge from '../atoms/Badge';
import { GitBranch, AlertCircle, Bookmark, Lightbulb } from 'lucide-react';

const TimelineView: React.FC = () => {
  const today = startOfToday();
  const daysToShow = 21;
  const timelineDays = useMemo(() => {
    return Array.from({ length: daysToShow }).map((_, i) => addDays(today, i - 5));
  }, [today]);

  const getTaskPosition = (startDateStr?: string, endDateStr?: string) => {
    if (!startDateStr || !endDateStr) return null;
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    
    const startDiff = differenceInDays(start, timelineDays[0]);
    const duration = differenceInDays(end, start) + 1;
    
    return {
      left: `${(startDiff / daysToShow) * 100}%`,
      width: `${(duration / daysToShow) * 100}%`
    };
  };

  return (
    <div className="flex flex-col h-full bg-background border border-border rounded-md overflow-hidden">
      {/* Timeline Header (Dates) */}
      <div className="flex border-b border-border bg-surface-hover/50">
        <div className="w-64 border-r border-border p-4 shrink-0 flex items-center gap-2">
          <GitBranch size={16} className="text-primary" />
          <span className="text-xs font-bold text-text-main">Project Roadmap</span>
        </div>
        <div className="flex-1 flex overflow-hidden">
          {timelineDays.map((day, i) => (
            <div 
              key={i} 
              className={`flex-1 min-w-[80px] p-3 text-center border-r border-border/50 last:border-r-0 ${isSameDay(day, today) ? 'bg-primary/5 border-x border-primary/20' : ''}`}
            >
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">{format(day, 'EEE')}</p>
              <p className={`text-sm font-bold ${isSameDay(day, today) ? 'text-primary' : 'text-text-main'}`}>{format(day, 'd')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Body */}
      <div className="flex-1 overflow-y-auto scrollbar-custom bg-background">
        {MOCK_TASKS.map((task) => {
          const pos = getTaskPosition(task.startDate, task.endDate);
          const Icon = task.type === 'Bug' ? AlertCircle : task.type === 'Issue' ? AlertCircle : task.type === 'Suggestion' ? Lightbulb : Bookmark;
          const color = task.type === 'Bug' ? 'bg-danger' : task.type === 'Issue' ? 'bg-warning' : 'bg-success';

          return (
            <div key={task.id} className="flex border-b border-border/50 hover:bg-surface-hover/30 transition-colors group">
              {/* Task Sidebar Label */}
              <div className="w-64 border-r border-border p-3 shrink-0 flex items-center gap-3">
                <Avatar name={task.assignee?.name} size="xs" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-text-main truncate">{task.title}</p>
                  <p className="text-[10px] font-mono text-text-muted">{task.taskId}</p>
                </div>
              </div>

              {/* Timeline Row */}
              <div className="flex-1 relative h-14 bg-background/30">
                {/* Vertical Grid Lines */}
                <div className="absolute inset-0 flex pointer-events-none">
                  {timelineDays.map((_, i) => (
                    <div key={i} className="flex-1 border-r border-border/20 last:border-r-0" />
                  ))}
                </div>

                {/* Task Bar */}
                {pos && (
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 h-8 flex items-center group/bar"
                    style={{ left: pos.left, width: pos.width }}
                  >
                    <div className={`w-full h-6 rounded-md border border-border/50 ${color}/10 relative flex items-center px-2 hover:h-7 transition-all cursor-pointer shadow-sm`}>
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${color} rounded-l-md`} />
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <Icon size={12} className={task.type === 'Bug' ? 'text-danger' : task.type === 'Issue' ? 'text-warning' : 'text-success'} />
                        <span className="text-[10px] font-bold text-text-main truncate">{task.taskId}</span>
                      </div>

                      {/* Tooltip on Hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-surface border border-border p-2 rounded shadow-xl opacity-0 group-hover/bar:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                         <div className="flex items-center gap-2 mb-1">
                            <Badge size="xs" variant={task.type === 'Bug' ? 'danger' : 'success'}>{task.status}</Badge>
                            <span className="text-[10px] text-text-main font-bold">{task.title}</span>
                         </div>
                         <p className="text-[9px] text-text-muted">Assigned to: {task.assignee?.name}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineView;
