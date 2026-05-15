'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, CheckCircle, Clock, AlertTriangle, Users } from 'lucide-react';

const completionData = [
  { name: 'Mon', completed: 4, new: 2 },
  { name: 'Tue', completed: 3, new: 5 },
  { name: 'Wed', completed: 7, new: 3 },
  { name: 'Thu', completed: 5, new: 8 },
  { name: 'Fri', completed: 8, new: 4 },
  { name: 'Sat', completed: 2, new: 1 },
  { name: 'Sun', completed: 6, new: 2 },
];

const taskStatusData = [
  { name: 'Completed', value: 35, color: '#DC2626' }, // Primary
  { name: 'In Progress', value: 45, color: '#F87171' }, // Accent
  { name: 'Review', value: 10, color: '#94A3B8' }, // Muted
  { name: 'Todo', value: 10, color: '#7F1D1D' }, // Deep
];

const AnimatedCounter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.toString(), 10);
    if (start === end) return;
    
    let totalMilSecDur = 1000;
    let incrementTime = (totalMilSecDur / end) * 2;
    
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
};

export default function DashboardPage() {
  const stats = [
    { title: 'Total Projects', value: 12, icon: Briefcase, color: 'text-blue-400' },
    { title: 'Completed Tasks', value: 35, icon: CheckCircle, color: 'text-emerald-400' },
    { title: 'Pending Tasks', value: 55, icon: Clock, color: 'text-amber-400' },
    { title: 'Overdue Tasks', value: 3, icon: AlertTriangle, color: 'text-red-500' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-heading font-bold text-white mb-1">Command Center</h2>
            <p className="text-ethara-muted text-sm">System performance and analytics overview.</p>
          </div>
          <button className="bg-ethara-primary/10 text-ethara-neon border border-ethara-border hover:bg-ethara-primary/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors hidden sm:block">
            Generate Report
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 hover-glow group cursor-default"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-ethara-surface border border-ethara-border/30 group-hover:border-ethara-neon/50 transition-colors ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-ethara-muted text-sm font-medium">{stat.title}</h3>
                <p className="text-3xl font-bold text-white mt-1">
                  <AnimatedCounter value={stat.value} />
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-auto">
          {/* Main Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="xl:col-span-2 glass-card rounded-2xl p-6 h-[400px]"
          >
            <h3 className="text-lg font-bold text-white mb-6">Weekly Productivity</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={completionData}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(17, 17, 17, 0.9)', borderColor: 'rgba(239, 68, 68, 0.3)', borderRadius: '8px' }}
                    itemStyle={{ color: '#F8FAFC' }}
                  />
                  <Area type="monotone" dataKey="completed" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Side Panel: Pie Chart & Activity */}
          <div className="flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="glass-card rounded-2xl p-6 flex-1 min-h-[250px]"
            >
              <h3 className="text-lg font-bold text-white mb-2">Task Distribution</h3>
              <div className="h-[180px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(17, 17, 17, 0.9)', borderColor: 'rgba(239, 68, 68, 0.3)', borderRadius: '8px', border: '1px solid' }}
                      itemStyle={{ color: '#F8FAFC' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="glass-card rounded-2xl p-6 flex-1 min-h-[250px] overflow-hidden"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users size={18} className="text-ethara-primary" /> Live Activity Feed
              </h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 relative">
                    <div className="w-8 h-8 rounded-full bg-ethara-surface flex items-center justify-center text-xs font-bold text-ethara-neon border border-ethara-border/30 shrink-0 z-10">
                      U{i}
                    </div>
                    {i !== 3 && <div className="absolute top-8 left-4 bottom-[-16px] w-[1px] bg-ethara-border/30"></div>}
                    <div>
                      <p className="text-sm text-white"><span className="font-bold">User {i}</span> completed task <span className="text-ethara-primary">#T{840-i}</span></p>
                      <p className="text-xs text-ethara-muted mt-0.5">{i * 15} mins ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
