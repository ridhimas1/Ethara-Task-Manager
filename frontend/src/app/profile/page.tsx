'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { Camera, Edit2, Save, Shield, Activity, Award, Star, Clock } from 'lucide-react';
import MagneticButton from '@/components/ui/MagneticButton';

const CircularProgress = ({ percentage, color }: { percentage: number, color: string }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="transform -rotate-90 w-20 h-20">
        <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-ethara-surface" />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          className={color}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-sm font-bold text-white">{percentage}%</span>
    </div>
  );
};

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [formData, setFormData] = useState({
    name: user?.name || 'Unknown User',
    bio: user?.bio || 'No bio provided.',
    skills: user?.skills || 'React, Node.js, Design',
  });

  const handleSave = () => {
    // In a real app, this would make an API call
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Profile Section */}
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-ethara-deep via-ethara-primary to-ethara-neon opacity-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center mt-12">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-ethara-surface border-4 border-ethara-bg shadow-[0_0_20px_rgba(239,68,68,0.3)] flex items-center justify-center text-4xl font-bold text-white overflow-hidden">
                {user?.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover"/> : user?.name?.charAt(0) || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-ethara-primary rounded-full flex items-center justify-center text-white border-2 border-ethara-bg hover:bg-ethara-neon transition-colors cursor-pointer opacity-0 group-hover:opacity-100">
                <Camera size={18} />
              </button>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="text-3xl font-heading font-bold text-white bg-ethara-surface/50 border border-ethara-border/50 rounded px-2 py-1 mb-2 focus:outline-none focus:border-ethara-neon"
                    />
                  ) : (
                    <h2 className="text-3xl font-heading font-bold text-white mb-2">{formData.name}</h2>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 text-ethara-primary font-bold bg-ethara-primary/10 px-3 py-1 rounded-full border border-ethara-primary/30">
                      <Shield size={14} /> {user?.role}
                    </span>
                    <span className="text-ethara-muted">{user?.email}</span>
                  </div>
                </div>
                
                <MagneticButton 
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isEditing ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-ethara-surface border border-ethara-border/50 text-white hover:border-ethara-primary'}`}
                >
                  {isEditing ? <><Save size={16}/> Save</> : <><Edit2 size={16}/> Edit Profile</>}
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex border-b border-ethara-border/30">
          {['overview', 'activity', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-bold capitalize transition-all relative ${activeTab === tab ? 'text-white' : 'text-ethara-muted hover:text-white'}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-ethara-primary shadow-[0_0_10px_#EF4444]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Details */}
          <div className="space-y-6 lg:col-span-1">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Award size={18} className="text-ethara-primary"/> About</h3>
              {isEditing ? (
                <textarea 
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full bg-ethara-surface/50 border border-ethara-border/50 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-ethara-neon min-h-[100px]"
                />
              ) : (
                <p className="text-ethara-muted text-sm leading-relaxed">{formData.bio}</p>
              )}

              <div className="mt-6">
                <h4 className="text-sm font-bold text-white mb-3">Skills & Expertise</h4>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    placeholder="Comma separated skills"
                    className="w-full bg-ethara-surface/50 border border-ethara-border/50 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-ethara-neon"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.split(',').map((skill, idx) => (
                      <span key={idx} className="bg-gradient-to-r from-ethara-surface to-ethara-bg border border-ethara-primary/30 text-ethara-text text-xs px-3 py-1.5 rounded-full font-medium shadow-[0_0_5px_rgba(239,68,68,0.1)]">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Performance Metrics</h3>
              <div className="flex justify-around">
                <div className="text-center">
                  <CircularProgress percentage={85} color="text-ethara-neon" />
                  <p className="text-xs text-ethara-muted mt-2 font-bold uppercase tracking-wider">Completion</p>
                </div>
                <div className="text-center">
                  <CircularProgress percentage={92} color="text-emerald-500" />
                  <p className="text-xs text-ethara-muted mt-2 font-bold uppercase tracking-wider">Efficiency</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-6 min-h-[400px]">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Activity size={18} className="text-ethara-primary"/> Recent Activity</h3>
              
              <div className="relative border-l border-ethara-border/30 ml-4 space-y-8 pb-4">
                {[1, 2, 3, 4].map((item, idx) => (
                  <motion.div 
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="relative pl-8"
                  >
                    {/* Timeline dot */}
                    <div className="absolute w-3 h-3 bg-ethara-neon rounded-full -left-[6.5px] top-1.5 shadow-[0_0_8px_#EF4444]"></div>
                    
                    <div className="bg-ethara-surface/40 border border-ethara-border/20 rounded-xl p-4 hover:border-ethara-primary/50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-white text-sm font-bold">Updated Task Status</h4>
                        <span className="text-xs text-ethara-muted flex items-center gap-1"><Clock size={12}/> {item * 2}h ago</span>
                      </div>
                      <p className="text-sm text-ethara-muted">Moved <span className="text-ethara-primary font-bold">#T482</span> to Review column.</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
