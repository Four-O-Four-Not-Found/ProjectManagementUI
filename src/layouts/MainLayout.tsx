import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/organisms/Sidebar';
import CommandPalette from '../components/organisms/CommandPalette';
import NotificationCenter from '../components/organisms/NotificationCenter';
import ThemeToggle from '../components/atoms/ThemeToggle';
import AccountModal from '../components/organisms/AccountModal';
import { Search, Bell, Command, Menu } from 'lucide-react';

import { useAuth } from '../hooks/useAuth';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-text-main overflow-hidden font-sans">
      <CommandPalette />
      <NotificationCenter 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
      <AccountModal 
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
      {/* Sidebar */}
      <Sidebar isCollapsed={!isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-border bg-surface z-20">
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md lg:hidden text-text-muted hover:bg-background transition-colors"
             >
                <Menu size={20} />
             </button>

             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-background border border-border text-text-muted text-sm hover:border-text-muted transition-colors cursor-pointer group">
                <Search size={16} />
                <span>Search or jump to...</span>
                <div className="hidden xl:flex items-center gap-1 ml-4 text-[10px] font-mono opacity-50">
                  <Command size={10} />
                  <span>K</span>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <button 
              onClick={() => setIsNotificationsOpen(true)}
              className="p-2 rounded-md hover:bg-background relative transition-colors group"
            >
              <Bell size={20} className="text-text-muted group-hover:text-text-main" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-surface"></span>
            </button>
            
            <div className="h-8 w-px bg-border"></div>
            
            <div className="flex items-center gap-3 pl-2 group cursor-pointer" onClick={() => setIsAccountModalOpen(true)}>
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-semibold text-text-main leading-tight">{user?.displayName || 'Guest'}</p>
                 <p className="text-[10px] text-text-muted uppercase tracking-wider">{user?.role || 'Visitor'}</p>
               </div>
               <div className="w-8 h-8 rounded-full border border-border overflow-hidden group-hover:border-primary transition-colors">
                 <img 
                   src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName || 'Guest'}`} 
                   alt="Avatar" 
                   className="w-full h-full object-cover"
                 />
               </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <div className="flex-1 overflow-auto scrollbar-custom p-6 bg-background">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
