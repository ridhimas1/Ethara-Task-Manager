'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, KeyRound, UserRound, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ThreeBackground from '@/components/ThreeBackground';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'ADMIN' | 'MEMBER'>('ADMIN');
  const [isHoveringEval, setIsHoveringEval] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const res = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });
      login(res.data.user, res.data.token);
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (demoRole: 'ADMIN' | 'MEMBER') => {
    setRole(demoRole);
    setValue('email', demoRole === 'ADMIN' ? 'admin@ethara.com' : 'member@ethara.com');
    setValue('password', demoRole === 'ADMIN' ? 'Admin@123' : 'Member@123');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ThreeBackground />
      
      <div className="z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-12 p-6">
        
        {/* Left Side - Evaluator Quick Access */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-sm"
          onMouseEnter={() => setIsHoveringEval(true)}
          onMouseLeave={() => setIsHoveringEval(false)}
        >
          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-ethara-primary relative overflow-hidden group">
            <div className="absolute inset-0 bg-ethara-primary/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
            <h3 className="text-xl font-heading text-ethara-neon mb-4 flex items-center gap-2">
              <KeyRound size={20} /> Evaluator Access
            </h3>
            
            <div className="space-y-4">
              {/* Admin Card */}
              <div 
                className="p-4 rounded-xl border border-ethara-border/50 bg-ethara-bg/50 cursor-pointer hover-glow relative overflow-hidden"
                onClick={() => fillDemo('ADMIN')}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-ethara-text flex items-center gap-2">
                    <UserRound size={16} className="text-ethara-primary"/> Admin
                  </span>
                </div>
                {isHoveringEval ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-xs text-ethara-muted">
                    <p>E: admin@ethara.com</p>
                    <p>P: Admin@123</p>
                  </motion.div>
                ) : (
                  <div className="font-mono text-xs text-ethara-muted/50 filter blur-[2px]">
                    <p>E: hidden@ethara.com</p>
                    <p>P: **********</p>
                  </div>
                )}
              </div>

              {/* Member Card */}
              <div 
                className="p-4 rounded-xl border border-ethara-border/50 bg-ethara-bg/50 cursor-pointer hover-glow relative overflow-hidden"
                onClick={() => fillDemo('MEMBER')}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-ethara-text flex items-center gap-2">
                    <UserRound size={16} className="text-ethara-accent"/> Member
                  </span>
                </div>
                {isHoveringEval ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-xs text-ethara-muted">
                    <p>E: member@ethara.com</p>
                    <p>P: Member@123</p>
                  </motion.div>
                ) : (
                  <div className="font-mono text-xs text-ethara-muted/50 filter blur-[2px]">
                    <p>E: hidden@ethara.com</p>
                    <p>P: **********</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md glass-card rounded-3xl p-8 neon-glow relative"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-ethara-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-ethara-neon/20 rounded-full blur-3xl" />
          
          <div className="text-center mb-8 relative z-10">
            <h1 className="text-4xl font-heading font-bold mb-2 neon-text">Ethara</h1>
            <p className="text-ethara-muted text-sm">System Authentication Protocol</p>
          </div>

          {/* Role Selector */}
          <div className="flex bg-ethara-surface/50 rounded-lg p-1 mb-6 relative z-10">
            <button
              onClick={() => setRole('ADMIN')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-300 ${role === 'ADMIN' ? 'bg-ethara-primary text-white shadow-lg shadow-ethara-primary/30' : 'text-ethara-muted hover:text-white'}`}
            >
              ADMIN
            </button>
            <button
              onClick={() => setRole('MEMBER')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-300 ${role === 'MEMBER' ? 'bg-ethara-primary text-white shadow-lg shadow-ethara-primary/30' : 'text-ethara-muted hover:text-white'}`}
            >
              MEMBER
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
            <div>
              <label className="block text-xs font-medium text-ethara-muted mb-1 uppercase tracking-wider">Email</label>
              <input 
                {...register('email')}
                type="email" 
                className="w-full bg-ethara-surface/50 border border-ethara-border/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ethara-neon focus:ring-1 focus:ring-ethara-neon transition-all"
                placeholder="Enter sequence..."
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-ethara-muted mb-1 uppercase tracking-wider">Passkey</label>
              <div className="relative">
                <input 
                  {...register('password')}
                  type={showPassword ? "text" : "password"} 
                  className="w-full bg-ethara-surface/50 border border-ethara-border/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ethara-neon focus:ring-1 focus:ring-ethara-neon transition-all"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ethara-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('rememberMe')} className="rounded border-ethara-border/50 bg-ethara-surface/50 text-ethara-primary focus:ring-ethara-primary focus:ring-offset-ethara-bg" />
                <span className="text-ethara-muted hover:text-white transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-ethara-primary hover:text-ethara-neon transition-colors">Lost access?</a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-ethara-deep to-ethara-primary hover:from-ethara-primary hover:to-ethara-neon text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all overflow-hidden relative group mt-4"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
              <span className="relative">{isLoading ? 'Authenticating...' : 'Initialize Session'}</span>
              {!isLoading && <ArrowRight size={18} className="relative group-hover:translate-x-1 transition-transform" />}
            </motion.button>
          </form>

        </motion.div>
      </div>
    </div>
  );
}
