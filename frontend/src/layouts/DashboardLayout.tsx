'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Briefcase, KanbanSquare, Users, UserCircle, Menu, X, LogOut, Code, Bell, Search } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Tasks', path: '/tasks', icon: KanbanSquare },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Profile', path: '/profile', icon: UserCircle },
    { name: 'Portfolio', path: '/portfolio', icon: Code },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-ethara-bg flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="hidden md:flex flex-col h-screen sticky top-0 border-r border-ethara-border/30 bg-ethara-surface/40 backdrop-blur-xl z-40 overflow-hidden shrink-0"
          >
            <div className="h-[72px] flex items-center px-6 border-b border-ethara-border/30 shrink-0">
              <h1 className="text-2xl font-heading font-bold neon-text truncate">Ethara</h1>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link href={item.path} key={item.name}>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${isActive ? 'bg-ethara-primary/20 text-ethara-neon border border-ethara-primary/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'text-ethara-muted hover:text-white hover:bg-ethara-surface'}`}>
                      <item.icon size={20} />
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="p-4 border-t border-ethara-border/30 shrink-0">
              <div 
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-ethara-muted hover:text-ethara-primary hover:bg-ethara-surface transition-all duration-300 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span className="font-medium text-sm">Sign Out</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-[72px] sticky top-0 z-30 border-b border-ethara-border/30 bg-ethara-surface/40 backdrop-blur-xl flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="text-ethara-muted hover:text-white transition-colors hidden md:block"
            >
              <Menu size={24} />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ethara-muted" size={18} />
              <input 
                type="text" 
                placeholder="Ctrl + K to search..." 
                className="bg-ethara-bg border border-ethara-border/30 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-ethara-neon focus:ring-1 focus:ring-ethara-neon w-64 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-ethara-muted hover:text-white relative transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-ethara-neon rounded-full shadow-[0_0_8px_rgba(239,68,68,1)]"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-white leading-none">{user?.name || 'User'}</p>
                <p className="text-xs text-ethara-primary mt-1">{user?.role || 'Role'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ethara-primary to-ethara-deep flex items-center justify-center font-bold text-white border-2 border-ethara-border/50">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
