import React, { useMemo, useState, useRef } from 'react';
import { 
  format, 
  addDays, 
  startOfToday, 
  differenceInDays, 
  isSameDay, 
  parseISO, 
  subDays
} from 'date-fns';
import { useProject } from '../../hooks/useProject';
import { useAppSelector } from '../../redux/hooks';
import EmptyState from '../molecules/EmptyState';
import Avatar from '../atoms/Avatar';
import Button from '../atoms/Button';
import ActivityDetailModal from '../organisms/ActivityDetailModal';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Target, Layout, ArrowRight } from 'lucide-react';
import type { Activity, Task, Project } from '../../types';

type ViewMode = 'Week' | 'Month';
type DataMode = 'Tasks' | 'Projects';

const TimelineView: React.FC = () => {
  const { projects, tasks, loading } = useProject();
  const recentActivities = useAppSelector(state => state.project.recentActivities || []);
  const today = startOfToday();
  const [viewMode, setViewMode] = useState<ViewMode>('Week');
  const [dataMode, setDataMode] = useState<DataMode>('Tasks');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [timelineStart, setTimelineStart] = useState<Date>(subDays(today, 5));
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const daysToShow = viewMode === 'Week' ? 14 : 35;

  const timelineDays = useMemo(() => {
    return Array.from({ length: daysToShow }).map((_, i) => addDays(timelineStart, i));
  }, [timelineStart, daysToShow]);

  const filteredItems = useMemo(() => {
    if (dataMode === 'Projects') return projects;
    
    if (selectedProjectId === 'all') return tasks;
    return tasks.filter(task => task.projectId === selectedProjectId);
  }, [dataMode, selectedProjectId, projects, tasks]);

  const getPosition = (startDateStr?: string, endDateStr?: string) => {
    // Note: startDate/endDate might not be directly in Task type now if I removed them, 
    // but they might be in the backend. I'll check.
    // In index.ts I have createdAt/updatedAt but maybe not startDate/endDate.
    // I'll use createdAt for now if missing.
    if (!startDateStr || !endDateStr) return null;
    try {
      const start = parseISO(startDateStr);
      const end = parseISO(endDateStr);
      const timelineEnd = timelineDays[timelineDays.length - 1];
      
      if (end < timelineStart || start > timelineEnd) return null;

      const effectiveStart = start < timelineStart ? timelineStart : start;
      const effectiveEnd = end > timelineEnd ? timelineEnd : end;

      const startDiff = differenceInDays(effectiveStart, timelineStart);
      const duration = differenceInDays(effectiveEnd, effectiveStart) + 1;
      
      return {
        left: (startDiff / daysToShow) * 100,
        width: (duration / daysToShow) * 100,
        isStartClamped: start < timelineStart,
        isEndClamped: end > timelineEnd,
        isMilestone: isSameDay(start, end)
      };
    } catch {
      return null;
    }
  };

  const navigateTimeline = (direction: 'prev' | 'next') => {
    const shift = viewMode === 'Week' ? 7 : 14;
    setTimelineStart(prev => direction === 'prev' ? subDays(prev, shift) : addDays(prev, shift));
  };

  return (
    <div className="flex flex-col h-full bg-background border border-border rounded-md overflow-hidden select-none shadow-sm">
      <ActivityDetailModal 
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        activity={selectedActivity}
      />

      {projects.length === 0 && !loading && (
        <div className="absolute inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-8">
           <EmptyState
             icon={CalendarIcon}
             title="No Schedule Available"
             description="Initialize a project and plan your first sprint to visualize your timeline here."
             className="max-w-md bg-surface shadow-2xl"
           />
        </div>
      )}

      {/* Gantt Controls */}
      <div className="p-3 border-b border-border bg-surface flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
          <div className="flex items-center gap-1 bg-background border border-border rounded-md p-1">
            <button 
              onClick={() => setViewMode('Week')}
              className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${viewMode === 'Week' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-main'}`}
            >
              Weekly
            </button>
            <button 
              onClick={() => setViewMode('Month')}
              className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${viewMode === 'Month' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-main'}`}
            >
              Monthly
            </button>
          </div>

          <div className="flex items-center gap-1 bg-background border border-border rounded-md p-1">
            <button 
              onClick={() => setDataMode('Tasks')}
              className={`flex items-center gap-2 px-3 py-1 text-[10px] font-bold rounded transition-all ${dataMode === 'Tasks' ? 'bg-merged text-white' : 'text-text-muted hover:text-text-main'}`}
            >
              <Layout size={12} />
              Sprint Gantt
            </button>
            <button 
              onClick={() => setDataMode('Projects')}
              className={`flex items-center gap-2 px-3 py-1 text-[10px] font-bold rounded transition-all ${dataMode === 'Projects' ? 'bg-merged text-white' : 'text-text-muted hover:text-text-main'}`}
            >
              <Target size={12} />
              Portfolio Gantt
            </button>
          </div>

          {dataMode === 'Tasks' && (
            <div className="flex items-center gap-2 px-2 py-1 bg-background border border-border rounded-md">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">View:</span>
              <select 
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-transparent text-[10px] font-bold text-text-main outline-none cursor-pointer focus:text-primary transition-colors"
              >
                <option value="all">Team Overview (All Tasks)</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.key})</option>
                ))}
              </select>
            </div>
          )}

          <span className="text-xs font-bold text-text-main font-mono">
            {format(timelineDays[0], 'MMM d')} — {format(timelineDays[timelineDays.length - 1], 'MMM d, yyyy')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button size="xs" variant="secondary" onClick={() => setTimelineStart(subDays(today, 5))}>Today</Button>
          <div className="flex items-center border border-border rounded-md overflow-hidden bg-background">
             <button onClick={() => navigateTimeline('prev')} className="p-1.5 hover:bg-surface-hover text-text-muted border-r border-border"><ChevronLeft size={14} /></button>
             <button onClick={() => navigateTimeline('next')} className="p-1.5 hover:bg-surface-hover text-text-muted"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative" ref={containerRef}>
        {/* Dates Header */}
        <div className="flex bg-surface-hover/50 border-b border-border z-20">
          <div className="w-32 md:w-64 border-r border-border p-4 shrink-0 flex items-center gap-2 bg-surface">
            <CalendarIcon size={16} className="text-primary" />
            <span className="text-xs font-bold text-text-main uppercase tracking-wider">{dataMode === 'Tasks' ? 'Schedule' : 'Roadmap'}</span>
          </div>
          <div className="flex-1 flex min-w-0 overflow-hidden">
            {timelineDays.map((day, i) => (
              <div 
                key={i} 
                className={`flex-1 min-w-[60px] p-2 text-center border-r border-border/20 last:border-r-0 relative transition-colors ${isSameDay(day, today) ? 'bg-primary/5' : ''}`}
              >
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">{format(day, 'EEE')}</p>
                <p className={`text-xs font-bold ${isSameDay(day, today) ? 'text-primary underline decoration-2 underline-offset-4' : 'text-text-main'}`}>{format(day, 'd')}</p>
                
                <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
                  {recentActivities.filter(a => a.createdAt && isSameDay(new Date(a.createdAt), day)).map(activity => (
                    <button
                      key={activity.id}
                      onClick={() => setSelectedActivity(activity)}
                      className="w-1.5 h-1.5 rounded-full bg-primary hover:scale-150 transition-transform cursor-pointer shadow-[0_0_8px_rgba(56,189,248,0.4)]"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gantt Rows */}
        <div className="flex-1 overflow-y-auto scrollbar-custom bg-background relative">
          {filteredItems.map((item: Task | Project) => {
            // Check for potential startDate/endDate if they were provided in partial Task
            const start = (item as any).startDate || (item as any).createdAt;
            const end = (item as any).endDate || (item as any).updatedAt;
            const pos = getPosition(start, end);
            const isProject = 'key' in item;
            const progress = (item as Task).progress || 0;
            const color = !isProject && (item as Task).type === 'Bug' ? 'bg-danger' : (!isProject && (item as Task).type === 'Issue' ? 'bg-warning' : 'bg-success');
            
            return (
              <div key={item.id} className="flex border-b border-border/50 hover:bg-surface-hover/10 transition-colors group relative">
                <div className="w-32 md:w-64 border-r border-border p-3 shrink-0 flex items-center gap-3 bg-surface/20 z-10 sticky left-0">
                  {isProject ? (
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <Target size={16} />
                    </div>
                  ) : (
                    <Avatar name={(item as Task).assignee?.name} size="xs" />
                  )}
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-text-main truncate">{isProject ? (item as Project).name : (item as Task).title}</p>
                    <div className="flex items-center gap-2">
                       <p className="text-[9px] font-mono text-text-muted uppercase">{isProject ? (item as Project).key : (item as Task).taskKey}</p>
                       {!isProject && <span className="text-[8px] font-bold text-text-muted">{progress}%</span>}
                    </div>
                  </div>
                </div>

                <div className="flex-1 relative h-12 min-w-0">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex pointer-events-none">
                    {timelineDays.map((day, i) => (
                      <div key={i} className={`flex-1 border-r border-border/10 last:border-r-0 ${isSameDay(day, today) ? 'bg-primary/[0.02]' : ''}`} />
                    ))}
                  </div>

                  {/* Task/Project Bar */}
                  {pos && (
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 h-7 flex items-center group/bar z-10"
                      style={{ left: `${pos.left}%`, width: `${pos.width}%` }}
                    >
                      {pos.isMilestone ? (
                        /* Milestone Diamond */
                        <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-accent-purple border-2 border-surface rotate-45 shadow-lg cursor-help">
                           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/bar:opacity-100 bg-surface border border-border p-1.5 rounded text-[10px] font-bold whitespace-nowrap pointer-events-none transition-opacity">Milestone: {isProject ? (item as Project).name : (item as Task).title}</div>
                        </div>
                      ) : (
                        <div className={`w-full h-5 rounded-sm border border-border/50 ${isProject ? 'bg-primary/5' : 'bg-surface'} relative flex items-center shadow-sm overflow-hidden group-hover/bar:h-6 transition-all`}>
                          {/* Background Color */}
                          <div className={`absolute inset-0 ${isProject ? 'bg-primary/10' : color + '/5'}`} />
                          
                          {/* Progress Fill */}
                          <div 
                            className={`absolute inset-y-0 left-0 ${isProject ? 'bg-primary/40' : color + '/30'} transition-all duration-1000`} 
                            style={{ width: `${progress}%` }} 
                          />
                          
                          {/* Side Indicator */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${isProject ? 'bg-primary' : color}`} />
                          
                          <div className="flex items-center gap-1.5 px-2 relative z-10 overflow-hidden">
                            <span className="text-[9px] font-bold text-text-main truncate">{isProject ? `${(item as Project).key} Roadmap` : (item as Task).taskKey}</span>
                            {progress > 0 && <span className="text-[8px] font-mono text-text-muted">{progress}%</span>}
                          </div>

                          {/* Task Dependencies Indicator */}
                          {!isProject && (item as Task).dependencies?.length ? (
                            <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-text-muted/50">
                               <ArrowRight size={10} />
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gantt Legend */}
      <div className="p-3 border-t border-border bg-surface-hover/30 flex items-center gap-6 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Legend:</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-success/20 border border-success/40" />
              <span className="text-[10px] text-text-main">Feature / Task</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-danger/20 border border-danger/40" />
              <span className="text-[10px] text-text-main">Bug / Fix</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-warning/20 border border-warning/40" />
              <span className="text-[10px] text-text-main">Issue / Risk</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent-purple rotate-45 border border-surface shadow-sm" />
              <span className="text-[10px] text-text-main">Milestone</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-border relative overflow-hidden rounded-full">
                 <div className="absolute inset-y-0 left-0 w-1/2 bg-text-muted/40" />
              </div>
              <span className="text-[10px] text-text-main">Progress Fill</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
