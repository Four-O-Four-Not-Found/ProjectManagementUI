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
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Target, Layout } from 'lucide-react';
import type { Activity, Task, Project } from '../../types';
import { AnimatePresence } from 'framer-motion';

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
    <div className="flex flex-col h-full bg-[#1e293b] border border-[#334155] rounded-lg overflow-hidden select-none shadow-none">
      <ActivityDetailModal 
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        activity={selectedActivity}
      />

      {projects.length === 0 && !loading && (
        <div className="absolute inset-0 z-[100] bg-[#0f172a] flex items-center justify-center p-8">
           <EmptyState
             icon={CalendarIcon}
             title="No Schedule Available"
             description="Initialize a project and plan your first sprint to visualize your timeline here."
             className="max-w-md bg-[#1e293b] border border-[#334155]"
           />
        </div>
      )}

      {/* Gantt Controls */}
      <div className="p-3 border-b border-[#334155] bg-[#0f172a]/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
          <div className="flex items-center gap-1 bg-[#0f172a] border border-[#334155] rounded-md p-1">
            <button 
              onClick={() => setViewMode('Week')}
              className={`px-4 py-1 text-[10px] font-bold rounded transition-all duration-200 ${viewMode === 'Week' ? 'bg-[#334155] text-white' : 'text-text-muted hover:text-white'}`}
            >
              Weekly
            </button>
            <button 
              onClick={() => setViewMode('Month')}
              className={`px-4 py-1 text-[10px] font-bold rounded transition-all duration-200 ${viewMode === 'Month' ? 'bg-[#334155] text-white' : 'text-text-muted hover:text-white'}`}
            >
              Monthly
            </button>
          </div>

          <div className="flex items-center gap-1 bg-[#0f172a] border border-[#334155] rounded-md p-1">
            <button 
              onClick={() => setDataMode('Tasks')}
              className={`flex items-center gap-2 px-4 py-1 text-[10px] font-bold rounded transition-all duration-200 ${dataMode === 'Tasks' ? 'bg-[#38bdf8] text-[#0f172a]' : 'text-text-muted hover:text-white'}`}
            >
              <Layout size={12} />
              Sprint
            </button>
            <button 
              onClick={() => setDataMode('Projects')}
              className={`flex items-center gap-2 px-4 py-1 text-[10px] font-bold rounded transition-all duration-200 ${dataMode === 'Projects' ? 'bg-[#38bdf8] text-[#0f172a]' : 'text-text-muted hover:text-white'}`}
            >
              <Target size={12} />
              Portfolio
            </button>
          </div>

          {dataMode === 'Tasks' && (
            <div className="flex items-center gap-3 px-3 py-1 bg-[#0f172a] border border-[#334155] rounded-md">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-tighter">View:</span>
              <select 
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-transparent text-[10px] font-bold text-text-main outline-none cursor-pointer focus:text-primary transition-colors border-none p-0"
              >
                <option value="all">Team Overview</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0f172a] border border-[#334155]">
            <CalendarIcon size={12} className="text-text-muted" />
            <span className="text-[10px] font-bold text-text-main font-mono">
              {format(timelineStart, 'MMM d')} — {format(timelineDays[timelineDays.length - 1], 'MMM d, yyyy')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button size="xs" variant="secondary" onClick={() => setTimelineStart(subDays(today, 5))} className="font-bold text-[9px] bg-[#334155] hover:bg-[#475569]">Today</Button>
          <div className="flex items-center border border-[#334155] rounded-md overflow-hidden bg-[#0f172a]">
             <button onClick={() => navigateTimeline('prev')} className="p-1.5 hover:bg-[#334155] text-text-muted border-r border-[#334155] transition-colors"><ChevronLeft size={14} /></button>
             <button onClick={() => navigateTimeline('next')} className="p-1.5 hover:bg-[#334155] text-text-muted transition-colors"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative" ref={containerRef}>
        {/* Dates Header */}
        <div className="flex bg-[#0f172a]/50 border-b border-[#334155] z-20 sticky top-0 backdrop-blur-md">
          <div className="w-32 md:w-64 border-r border-[#334155] p-4 shrink-0 flex items-center gap-3 bg-[#1e293b]">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{dataMode === 'Tasks' ? 'Schedule' : 'Roadmap'}</span>
          </div>
          <div className="flex-1 flex min-w-0 overflow-hidden">
            {timelineDays.map((day, i) => (
              <div 
                key={i} 
                className={`flex-1 min-w-[65px] p-2 text-center border-r border-[#334155]/40 last:border-r-0 relative transition-colors ${isSameDay(day, today) ? 'bg-[#38bdf8]/10' : ''}`}
              >
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-tighter opacity-60 mb-0.5">{format(day, 'EEE')}</p>
                <p className={`text-[11px] font-bold tabular-nums ${isSameDay(day, today) ? 'text-[#38bdf8]' : 'text-text-main'}`}>{format(day, 'd')}</p>
                
                {isSameDay(day, today) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#38bdf8]" />
                )}
                
                <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
                  {recentActivities.filter(a => a.createdAt && isSameDay(new Date(a.createdAt), day)).map(activity => (
                    <div
                      key={activity.id}
                      className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] shadow-sm"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gantt Rows */}
        <div className="flex-1 overflow-y-auto scrollbar-custom bg-[#0f172a] relative">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item: Task | Project) => {
              const start = item.createdAt;
              const end = item.updatedAt;
              const pos = getPosition(start, end);
              const isProject = 'key' in item;
              const progress = (item as Task).progress || 0;
              
              let taskColor = 'var(--accent-primary)';
              if (!isProject) {
                const t = item as Task;
                if (t.type === 'Bug') taskColor = '#0284c7'; // Sky 600
                else if (t.type === 'Issue') taskColor = '#7dd3fc'; // Sky 300
              }

              const isUrgent = !isProject && (item as Task).priority === 'Urgent';

              return (
                <div 
                  key={item.id} 
                  className="flex border-b border-[#334155]/50 hover:bg-[#1e293b]/50 transition-colors group relative h-14"
                >
                  {/* Left Sidebar Info */}
                  <div className="w-32 md:w-64 border-r border-[#334155] p-3 shrink-0 flex items-center gap-3 bg-[#1e293b] z-10 sticky left-0">
                    {isProject ? (
                      <div className="w-8 h-8 rounded bg-[#334155] flex items-center justify-center text-[#38bdf8] border border-[#475569]">
                        <Target size={16} />
                      </div>
                    ) : (
                      <Avatar name={(item as Task).taskAssignees?.[0]?.user?.displayName} src={(item as Task).taskAssignees?.[0]?.user?.avatarUrl} size="xs" />
                    )}
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-text-main truncate group-hover:text-[#38bdf8] transition-colors tracking-tight">{isProject ? (item as Project).name : (item as Task).title}</p>
                      <div className="flex items-center gap-2">
                         <p className="text-[9px] font-mono text-text-muted/60 uppercase">{isProject ? (item as Project).key : (item as Task).taskKey}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Grid & Bars */}
                  <div className="flex-1 relative min-w-0">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex pointer-events-none">
                      {timelineDays.map((_, i) => (
                        <div key={i} className="flex-1 border-r border-[#334155]/20 last:border-r-0" />
                      ))}
                    </div>

                    {/* Task/Project Bar */}
                    {pos && (
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 h-8 flex items-center group/bar z-10 px-0.5"
                        style={{ left: `${pos.left}%`, width: `${pos.width}%` }}
                      >
                        {pos.isMilestone ? (
                          <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[#38bdf8] border-2 border-[#1e293b] rotate-45 shadow-md cursor-help z-20 hover:scale-110 transition-transform">
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/bar:opacity-100 bg-[#1e293b] border border-[#475569] p-2 rounded text-[10px] font-bold whitespace-nowrap pointer-events-none transition-all shadow-xl z-50">
                               {isProject ? (item as Project).name : (item as Task).title}
                             </div>
                          </div>
                        ) : (
                          <div className={`w-full h-6 rounded border ${isUrgent ? 'border-[#38bdf8]' : 'border-[#475569]'} bg-[#1e293b] relative flex items-center shadow-sm transition-all cursor-pointer overflow-hidden group-hover/bar:border-[#38bdf8]/50`}>
                            {/* Progress Fill */}
                            <div 
                              className="absolute inset-y-0 left-0 bg-[#334155]" 
                              style={{ width: `${progress}%` }}
                            />
                            
                            {/* Edge Accent */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${isUrgent ? 'animate-pulse' : ''}`} style={{ backgroundColor: taskColor }} />
                            
                            <div className="flex items-center gap-2 px-2 relative z-10 overflow-hidden w-full">
                              <span className="text-[9px] font-black text-text-main truncate tracking-tight uppercase">
                                {isProject ? (item as Project).key : (item as Task).taskKey}
                              </span>
                              {!isProject && (
                                <span className="text-[8px] font-bold text-text-muted opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                                  {progress}% • {isUrgent ? 'Urgent' : (item as Task).type}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Gantt Legend - Matte */}
      <div className="px-6 py-2 border-t border-[#334155] bg-[#1e293b] flex items-center justify-between">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-sm bg-[#38bdf8]" />
              <span className="text-[9px] font-bold text-text-muted uppercase">Feature</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-sm bg-[#0284c7]" />
              <span className="text-[9px] font-bold text-text-muted uppercase">Bug</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#38bdf8] rotate-45 border border-[#1e293b]" />
              <span className="text-[9px] font-bold text-text-muted uppercase">Milestone</span>
           </div>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
           <span className="text-[9px] font-black text-text-muted uppercase tracking-tighter opacity-60">System Synchronized</span>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
