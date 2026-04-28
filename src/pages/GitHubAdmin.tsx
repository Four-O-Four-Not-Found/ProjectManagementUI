import React from 'react';
import { 
  Trash2,
  Clock,
  ExternalLink,
  GitBranch
} from 'lucide-react';
import Badge from '../components/atoms/Badge';
import Button from '../components/atoms/Button';
import GlassCard from '../components/molecules/GlassCard';
import PageHeader from '../components/molecules/PageHeader';

import { useConfirm } from '../hooks/useConfirm';
import { useToast } from '../hooks/useToast';

const repositories = [
  { id: '1', name: 'ProjectManager.API', status: 'Healthy', branch: 'main', lastSync: '2m ago' },
  { id: '2', name: 'ProjectManager.UI', status: 'Healthy', branch: 'develop', lastSync: '15m ago' },
  { id: '3', name: 'ProjectManager.Docs', status: 'Warning', branch: 'main', lastSync: '2h ago', error: '401 Unauthorized' },
];

const GitHubAdmin: React.FC = () => {
  const { confirm } = useConfirm();
  const { success, error } = useToast();

  const handleDeleteRepository = async (repoName: string) => {
    const ok = await confirm({
      title: 'Disconnect Repository',
      message: `Are you sure you want to disconnect ${repoName}? This will stop all automated pipeline triggers.`,
      confirmText: 'Disconnect',
      type: 'danger'
    });

    if (ok) {
      success('Repository Disconnected', `${repoName} has been removed from the pipeline.`);
    }
  };

  const handleDeleteBranch = async (branchName: string) => {
    const ok = await confirm({
      title: 'Prune Stale Branch',
      message: `You are about to delete ${branchName} from the remote. This action is irreversible.`,
      confirmText: 'Delete Forever',
      type: 'danger'
    });

    if (ok) {
      success('Branch Pruned', `${branchName} has been deleted.`);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <PageHeader 
        title="GitHub Pipeline"
        description="Manage repository bindings and monitor webhook health."
        actions={
          <Button className="w-full md:w-auto bg-[#2ea44f] hover:shadow-[0_0_20px_rgba(46,164,79,0.4)]" leftIcon={<GitBranch size={18} />}>
            Connect Repository
          </Button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <GlassCard noPadding className="overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.05] bg-white/[0.02] flex justify-between items-center">
              <h3 className="font-bold text-white">Repository Binder</h3>
              <Badge variant="secondary">3 Connected</Badge>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {repositories.map((repo) => (
                <div key={repo.id} className="p-6 flex items-center justify-between hover:bg-white/[0.01] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/[0.05] flex items-center justify-center text-slate-400">
                      <GitBranch size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white flex items-center gap-2">
                        {repo.name} <ExternalLink size={12} className="text-slate-600" />
                      </h4>
                      <p className="text-xs text-slate-500">Default branch: <span className="font-mono text-primary">{repo.branch}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                       <div className="flex items-center gap-1.5 mb-1 justify-end">
                         <Badge variant={repo.status === 'Healthy' ? 'success' : 'warning'} size="xs">
                            {repo.status}
                         </Badge>
                       </div>
                       <p className="text-[10px] text-slate-500 uppercase">Last sync: {repo.lastSync}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-slate-500 hover:text-rose-500"
                      onClick={() => handleDeleteRepository(repo.name)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
             <div className="flex items-center gap-3 mb-6">
               <Clock size={20} className="text-amber-400" />
               <h3 className="font-bold text-white">Branch Orphanage</h3>
             </div>
             <p className="text-sm text-slate-400 mb-6">Stale branches with project prefixes that haven't been active for 14+ days.</p>
             <div className="space-y-3">
               {[
                 { name: 'feature/WEB-38-legacy-auth', days: 22, author: 'John Doe' },
                 { name: 'fix/WEB-12-ie11-support', days: 45, author: 'Sarah J.' },
               ].map((branch) => (
                 <div key={branch.name} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                    <div className="flex items-center gap-3">
                       <span className="font-mono text-sm text-slate-300">{branch.name}</span>
                       <Badge variant="secondary" size="xs">{branch.author}</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-xs text-rose-400 font-bold">{branch.days} days stale</span>
                       <button 
                        onClick={() => handleDeleteBranch(branch.name)}
                        className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
                      >
                        Delete
                      </button>
                    </div>
                 </div>
               ))}
             </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
           <GlassCard className="p-6">
              <h3 className="font-bold text-white mb-6">Webhook Health</h3>
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-white">Project Pipeline</p>
                       <p className="text-[10px] text-slate-500 uppercase">Operational</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]"></div>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-white">Auth Webhooks</p>
                       <p className="text-[10px] text-slate-500 uppercase">Latency Issues</p>
                    </div>
                 </div>
              </div>
           </GlassCard>

           <GlassCard className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-bold text-white mb-4">Pipeline Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/[0.05]">
                    <p className="text-2xl font-bold text-white">412</p>
                    <p className="text-[10px] text-slate-500 uppercase">Syncs Today</p>
                 </div>
                 <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/[0.05]">
                    <p className="text-2xl font-bold text-white">99.9%</p>
                    <p className="text-[10px] text-slate-500 uppercase">Uptime</p>
                 </div>
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default GitHubAdmin;
