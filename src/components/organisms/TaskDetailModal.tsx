import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Paperclip, 
  Clock, 
  Send, 
  Plus,
  Image as ImageIcon,
  AlertCircle,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import Button from '../atoms/Button';
import Avatar from '../atoms/Avatar';
import Badge from '../atoms/Badge';
import type { Task } from '../../types';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, onClose, task }) => {
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'activity' | 'attachments'>('details');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] glass-panel rounded-[32px] border-white/[0.1] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-white/[0.05] flex items-start justify-between bg-white/[0.01]">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                  {task.taskId}
                </span>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.05] border border-white/[0.1]">
                  {task.type === 'Issue' && <AlertCircle size={14} className="text-rose-400" />}
                  {task.type === 'Suggestion' && <Lightbulb size={14} className="text-amber-400" />}
                  {task.type === 'Feature' && <CheckCircle2 size={14} className="text-primary" />}
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{task.type}</span>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{task.title}</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Left Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-custom">
              <div className="flex gap-4 border-b border-white/[0.05] mb-8">
                {(['details', 'activity', 'attachments'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
                      activeTab === tab ? 'text-primary' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
                    )}
                  </button>
                ))}
              </div>

              {activeTab === 'details' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="prose prose-invert max-w-none">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Description</h3>
                    <p className="text-slate-300 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/[0.03]">
                      {task.description || "No description provided for this entry."}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Visual Evidence / Attachments</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {task.attachments?.filter(a => a.type === 'image').map((img) => (
                        <div key={img.id} className="aspect-video rounded-2xl overflow-hidden border border-white/[0.05] group relative cursor-pointer">
                          <img src={img.url} alt={img.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Plus className="text-white" />
                          </div>
                        </div>
                      ))}
                      <button className="aspect-video rounded-2xl border-2 border-dashed border-white/[0.1] hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group">
                        <ImageIcon className="text-slate-500 group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase group-hover:text-primary transition-colors">Add Image</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-6 animate-fade-in">
                  {task.comments?.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <Avatar name={comment.userName} size="sm" />
                      <div className="flex-1 bg-white/[0.03] rounded-2xl p-4 border border-white/[0.05]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-white">{comment.userName}</span>
                          <span className="text-[10px] text-slate-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-4 mt-8">
                    <Avatar name="You" size="sm" />
                    <div className="flex-1 relative">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a suggestion or comment..."
                        className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-primary/50 transition-all min-h-[100px] resize-none"
                      />
                      <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <button className="p-2 text-slate-500 hover:text-white transition-colors">
                          <Paperclip size={18} />
                        </button>
                        <Button size="sm" className="h-10 px-4" rightIcon={<Send size={16} />}>
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Details */}
            <div className="w-full md:w-72 bg-white/[0.02] border-l border-white/[0.05] p-6 md:p-8 space-y-8">
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Properties</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Status</span>
                    <Badge variant="primary" size="sm">{task.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Priority</span>
                    <Badge variant={task.priority === 'Urgent' ? 'danger' : 'warning'} size="sm">{task.priority}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Entry Type</span>
                    <select 
                      className="bg-transparent text-xs font-bold text-primary outline-none cursor-pointer"
                      value={task.type}
                    >
                      <option value="Feature">Feature</option>
                      <option value="Issue">Issue</option>
                      <option value="Suggestion">Suggestion</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Assignee</h3>
                <div className="flex items-center gap-3 bg-white/[0.03] p-3 rounded-2xl border border-white/[0.05]">
                  <Avatar name={task.assignee?.name || 'Unassigned'} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{task.assignee?.name || 'Unassigned'}</p>
                    <p className="text-[10px] text-slate-500 truncate">Core Team</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Dates</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={14} className="text-slate-600" />
                    <span>Created Apr 10</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={14} className="text-slate-600" />
                    <span>Updated 2h ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskDetailModal;
