'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ThreeBackground from '@/components/ThreeBackground';
import DashboardLayout from '@/layouts/DashboardLayout';
import MagneticButton from '@/components/ui/MagneticButton';
import { Download, ChevronDown, Send, Briefcase, GraduationCap, Code } from 'lucide-react';

const TypewriterText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayText(text.substring(0, i + 1));
      i++;
      if (i === text.length) clearInterval(timer);
    }, 100);
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayText}<span className="animate-pulse">_</span></span>;
};

export default function PortfolioPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const skills = [
    { name: 'React / Next.js', level: 95 },
    { name: 'TypeScript', level: 90 },
    { name: 'Node.js / Express', level: 85 },
    { name: 'PostgreSQL / Prisma', level: 80 },
    { name: 'Three.js / WebGL', level: 75 },
    { name: 'UI/UX Design', level: 85 },
  ];

  const experience = [
    { year: '2024 - Present', role: 'Senior Full Stack Engineer', company: 'Nexus Corp', desc: 'Leading the development of highly scalable microservices architecture.' },
    { year: '2021 - 2024', role: 'Frontend Developer', company: 'Creative Agency', desc: 'Built award-winning interactive websites using React and Three.js.' },
    { year: '2019 - 2021', role: 'UI Designer', company: 'Startup Inc', desc: 'Designed design systems and component libraries.' },
  ];

  return (
    <DashboardLayout>
      <div ref={containerRef} className="relative min-h-screen rounded-3xl overflow-hidden border border-ethara-border/30 bg-ethara-bg">
        <ThreeBackground />
        
        {/* Spotlight Cursor Effect */}
        <div 
          className="pointer-events-none fixed inset-0 z-20 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, rgba(239, 68, 68, 0.05), transparent 80%)`
          }}
        />

        {/* Hero Section */}
        <div className="relative h-[80vh] flex flex-col items-center justify-center text-center z-10 px-4">
          <motion.div style={{ y, opacity }} className="space-y-6 max-w-4xl">
            <h2 className="text-ethara-primary font-mono text-sm tracking-[0.2em] uppercase">System Architect</h2>
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight">
              I Engineer <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ethara-neon via-ethara-primary to-ethara-deep neon-text">
                <TypewriterText text="Digital Experiences." />
              </span>
            </h1>
            <p className="text-ethara-muted text-lg max-w-2xl mx-auto">
              Specializing in futuristic, high-performance web applications with immersive 3D interfaces and robust backend architectures.
            </p>
            
            <div className="flex justify-center gap-4 pt-8">
              <MagneticButton className="bg-ethara-primary hover:bg-ethara-neon text-white px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex items-center gap-2">
                <Briefcase size={18} /> View Projects
              </MagneticButton>
              <MagneticButton className="bg-transparent border border-ethara-primary/50 text-white hover:border-ethara-neon px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2">
                <Download size={18} /> Resume
              </MagneticButton>
            </div>
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 text-ethara-muted"
          >
            <ChevronDown size={32} />
          </motion.div>
        </div>

        {/* About & Skills Section */}
        <div className="relative z-10 bg-ethara-surface/80 backdrop-blur-xl border-y border-ethara-border/30 py-20 px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-heading font-bold text-white mb-6 flex items-center gap-3">
                <Code className="text-ethara-primary"/> Core Stack
              </h3>
              <p className="text-ethara-muted mb-8 leading-relaxed">
                My tech stack is focused on modern Javascript ecosystems. I build scalable backends with Node/Prisma and highly interactive frontends with React and Framer Motion. I obsess over clean code, performance, and pixel-perfect design.
              </p>
              
              <div className="space-y-6">
                {skills.map((skill, idx) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm text-white mb-2">
                      <span>{skill.name}</span>
                      <span className="text-ethara-primary font-mono">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-ethara-bg rounded-full h-1">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className="bg-gradient-to-r from-ethara-deep to-ethara-neon h-1 rounded-full shadow-[0_0_10px_#EF4444]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-heading font-bold text-white mb-8 flex items-center gap-3">
                <GraduationCap className="text-ethara-primary"/> Experience
              </h3>
              <div className="relative border-l border-ethara-primary/30 ml-3 space-y-10">
                {experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-8">
                    <div className="absolute w-4 h-4 bg-ethara-bg border-2 border-ethara-neon rounded-full -left-[8.5px] top-1 shadow-[0_0_10px_#EF4444]"></div>
                    <span className="text-ethara-primary font-mono text-sm tracking-widest">{exp.year}</span>
                    <h4 className="text-xl font-bold text-white mt-1">{exp.role}</h4>
                    <p className="text-ethara-muted text-sm mt-1 mb-2 font-bold">{exp.company}</p>
                    <p className="text-ethara-muted/80 text-sm leading-relaxed">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="relative z-10 py-20 px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto glass-card rounded-3xl p-10 neon-glow"
          >
            <div className="text-center mb-10">
              <h3 className="text-3xl font-heading font-bold text-white mb-2">Initiate Contact</h3>
              <p className="text-ethara-muted">Open for new opportunities and collaborations.</p>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-ethara-muted mb-2 uppercase">Name</label>
                  <input type="text" className="w-full bg-ethara-surface/50 border border-ethara-border/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ethara-neon transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ethara-muted mb-2 uppercase">Email</label>
                  <input type="email" className="w-full bg-ethara-surface/50 border border-ethara-border/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ethara-neon transition-colors" placeholder="john@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-ethara-muted mb-2 uppercase">Message</label>
                <textarea rows={4} className="w-full bg-ethara-surface/50 border border-ethara-border/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ethara-neon transition-colors" placeholder="Your transmission..." />
              </div>
              <MagneticButton className="w-full bg-gradient-to-r from-ethara-deep to-ethara-primary hover:from-ethara-primary hover:to-ethara-neon text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all">
                Transmit Message <Send size={18} />
              </MagneticButton>
            </form>
          </motion.div>
        </div>

      </div>
    </DashboardLayout>
  );
}
