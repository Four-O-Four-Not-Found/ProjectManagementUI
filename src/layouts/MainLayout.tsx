import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/organisms/Sidebar';
import CommandPalette from '../components/organisms/CommandPalette';
import NotificationCenter from '../components/organisms/NotificationCenter';
import { Search, Bell, Command, Menu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-main overflow-hidden bg-mesh">
      <CommandPalette />
      <NotificationCenter 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-white/[0.05] bg-background/50 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-xl lg:hidden text-muted hover:bg-white/[0.05]"
             >
                <Menu size={20} />
             </button>

             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-muted text-sm hover:bg-white/[0.05] transition-colors cursor-pointer group">
                <Search size={16} className="group-hover:text-primary transition-colors" />
                <span>Search or jump to...</span>
                <div className="hidden xl:flex items-center gap-1 ml-4 text-[10px] font-medium opacity-50">
                   <Command size={10} />
                   <span>K</span>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsNotificationsOpen(true)}
              className="p-2 rounded-full hover:bg-white/[0.05] relative transition-colors group"
            >
              <Bell size={20} className="text-muted group-hover:text-main" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background shadow-[0_0_8px_rgba(56,189,248,0.5)]"></span>
            </button>
            
            <div className="h-8 w-px bg-white/[0.05]"></div>
            
            <div className="flex items-center gap-3 pl-2 group cursor-pointer" onClick={logout}>
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-semibold text-main leading-tight">{user?.displayName || 'Guest'}</p>
                 <p className="text-[10px] text-muted uppercase tracking-wider">{user?.role || 'Visitor'}</p>
               </div>
               <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-accent-purple p-0.5 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                 <img 
                   src={user?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"} 
                   alt="Avatar" 
                   className="w-full h-full rounded-full bg-slate-900 object-cover"
                 />
               </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <div className="flex-1 overflow-auto scrollbar-custom p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
