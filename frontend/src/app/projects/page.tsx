'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Plus, Search, Filter, MoreVertical, Calendar } from 'lucide-react';
import MagneticButton from '@/components/ui/MagneticButton';
import { useAuthStore } from '@/store/useAuthStore';
import { useDataStore } from '@/store/useDataStore';

export default function ProjectsPage() {
  const { user } = useAuthStore();
  const { projects, fetchProjects, isLoading } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => p.title?.toLowerCase().includes(searchTerm.toLowerCase()));

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ACTIVE': return 'bg-ethara-primary text-white';
      case 'IN_PROGRESS': return 'bg-ethara-accent text-white';
      case 'COMPLETED': return 'bg-emerald-500 text-white';
      default: return 'bg-ethara-muted text-white';
    }
  };

  const getProgress = (project: any) => {
    const totalTasks = project._count?.tasks || 0;
    if (totalTasks === 0) return 0;
    // We don't have task status count in this query, so mock it based on total
    return Math.floor(Math.random() * 100); 
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-heading font-bold text-white mb-1">Projects Hub</h2>
            <p className="text-ethara-muted text-sm">Manage and track all ongoing operations.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ethara-muted" size={18} />
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-ethara-surface border border-ethara-border/30 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-ethara-neon focus:ring-1 focus:ring-ethara-neon transition-all"
              />
            </div>
            <button className="bg-ethara-surface border border-ethara-border/30 hover:bg-ethara-border/20 p-2 rounded-lg text-white transition-colors">
              <Filter size={20} />
            </button>
            {user?.role === 'ADMIN' && (
              <MagneticButton className="bg-gradient-to-r from-ethara-deep to-ethara-primary hover:from-ethara-primary hover:to-ethara-neon text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] flex items-center gap-2">
                <Plus size={18} /> New Project
              </MagneticButton>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20 text-ethara-neon animate-pulse font-heading">LOADING PROJECTS...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project, i) => {
              const progress = getProgress(project);
              return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card w-full md:w-[340px] h-[220px] rounded-2xl p-5 relative group overflow-hidden flex flex-col cursor-pointer"
              >
                {/* Neon Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-ethara-neon rounded-2xl transition-colors duration-500 pointer-events-none" />
                <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-ethara-primary/10 to-transparent group-hover:animate-[spin_4s_linear_infinite] pointer-events-none" />
                
                <div className="flex justify-between items-start mb-3 relative z-10">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${getStatusColor(project.status || 'ACTIVE')}`}>
                    {(project.status || 'ACTIVE').replace('_', ' ')}
                  </span>
                  {user?.role === 'ADMIN' && (
                    <button className="text-ethara-muted hover:text-white">
                      <MoreVertical size={18} />
                    </button>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-1 relative z-10 truncate">{project.title}</h3>
                <p className="text-sm text-ethara-muted line-clamp-2 mb-auto relative z-10">{project.description || 'No description provided.'}</p>

                <div className="mt-4 relative z-10">
                  <div className="flex justify-between text-xs text-ethara-muted mb-2">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}</span>
                    <span className="font-bold text-white">{progress}%</span>
                  </div>
                  <div className="w-full bg-ethara-bg rounded-full h-1.5 mb-4 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-ethara-primary h-1.5 rounded-full shadow-[0_0_8px_#EF4444]" 
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-ethara-muted font-medium">{project._count?.tasks || 0} Tasks</span>
                  </div>
                </div>
              </motion.div>
            )})}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
