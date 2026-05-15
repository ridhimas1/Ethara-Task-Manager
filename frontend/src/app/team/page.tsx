'use client';

import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Search, Mail, MessageSquare, Activity, CheckCircle, Award } from 'lucide-react';

const members = [
  { id: 1, name: 'Alice Walker', role: 'ADMIN', title: 'Lead Engineer', status: 'online', score: 98, tasks: 12, completed: 45, skills: ['React', 'Node.js', 'System Architecture'] },
  { id: 2, name: 'Bob Smith', role: 'MEMBER', title: 'UI/UX Designer', status: 'offline', score: 85, tasks: 5, completed: 20, skills: ['Figma', 'Framer', 'CSS'] },
  { id: 3, name: 'Charlie Davis', role: 'MEMBER', title: 'Backend Developer', status: 'online', score: 92, tasks: 8, completed: 34, skills: ['PostgreSQL', 'Prisma', 'Express'] },
  { id: 4, name: 'Diana Prince', role: 'MEMBER', title: 'Project Manager', status: 'busy', score: 95, tasks: 2, completed: 15, skills: ['Agile', 'Scrum', 'Planning'] },
];

const TiltCard = ({ member }: { member: typeof members[0] }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online': return 'bg-emerald-500 shadow-[0_0_10px_#10b981]';
      case 'busy': return 'bg-amber-500 shadow-[0_0_10px_#f59e0b]';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="w-full md:w-[300px] h-[420px] glass-card rounded-3xl p-6 relative group border border-ethara-border/30 hover:border-ethara-neon transition-colors duration-300"
    >
      {/* 3D Content Container */}
      <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }} className="w-full h-full flex flex-col items-center">
        
        {/* Profile Ring */}
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-ethara-primary border-r-ethara-neon animate-[spin_3s_linear_infinite] group-hover:animate-[spin_1s_linear_infinite]"></div>
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-ethara-surface to-ethara-bg border-4 border-ethara-border/20 flex items-center justify-center m-1">
            <span className="text-3xl font-bold text-white">{member.name.charAt(0)}</span>
          </div>
          {/* Status Indicator */}
          <div className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-ethara-surface ${getStatusColor(member.status)}`}></div>
        </div>

        {/* Info */}
        <h3 className="text-xl font-bold text-white mb-1 tracking-wide">{member.name}</h3>
        <p className="text-ethara-primary text-sm font-medium mb-3">{member.title}</p>
        <span className="bg-ethara-bg text-ethara-muted text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-ethara-border/30 mb-6">
          {member.role}
        </span>

        {/* Stats */}
        <div className="w-full grid grid-cols-3 gap-2 text-center mb-6">
          <div className="bg-ethara-surface/50 rounded-lg py-2">
            <p className="text-ethara-muted text-xs mb-1"><Activity size={14} className="mx-auto"/></p>
            <p className="text-white font-bold">{member.score}%</p>
          </div>
          <div className="bg-ethara-surface/50 rounded-lg py-2">
            <p className="text-ethara-muted text-xs mb-1"><Award size={14} className="mx-auto"/></p>
            <p className="text-white font-bold">{member.tasks}</p>
          </div>
          <div className="bg-ethara-surface/50 rounded-lg py-2">
            <p className="text-ethara-muted text-xs mb-1"><CheckCircle size={14} className="mx-auto"/></p>
            <p className="text-white font-bold">{member.completed}</p>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap justify-center gap-2 mb-auto">
          {member.skills.map(skill => (
            <span key={skill} className="text-[10px] text-ethara-muted bg-ethara-surface border border-ethara-border/20 px-2 py-1 rounded">
              {skill}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ transform: "translateZ(30px)" }} className="flex justify-center gap-4 mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-10 h-10 rounded-full bg-ethara-surface border border-ethara-border hover:border-ethara-primary hover:text-ethara-neon text-white flex items-center justify-center transition-all hover-glow">
            <Mail size={18} />
          </button>
          <button className="w-10 h-10 rounded-full bg-ethara-surface border border-ethara-border hover:border-ethara-primary hover:text-ethara-neon text-white flex items-center justify-center transition-all hover-glow">
            <MessageSquare size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-heading font-bold text-white mb-1">Squad Directory</h2>
            <p className="text-ethara-muted text-sm">Real-time team analytics and status.</p>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ethara-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search operatives..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-ethara-surface border border-ethara-border/30 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-ethara-neon focus:ring-1 focus:ring-ethara-neon transition-all"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-8 justify-center md:justify-start" style={{ perspective: "1000px" }}>
          {filteredMembers.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <TiltCard member={member} />
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
