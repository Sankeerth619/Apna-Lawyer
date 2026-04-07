import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Scale, CheckCircle2, Shield, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', confirm_password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return 0;
    let strength = 0;
    if (p.length > 6) strength += 1;
    if (/[A-Z]/.test(p)) strength += 1;
    if (/[0-9]/.test(p)) strength += 1;
    if (/[^A-Za-z0-9]/.test(p)) strength += 1;
    if (p.length > 10) strength += 1;
    return strength;
  };

  const strength = getPasswordStrength();
  const strengthColors = ['bg-red-500', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-green-500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      login(res.data.token, res.data.user);
      toast.success("Account created successfully!");
      navigate('/bot');
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-dark-base relative order-2 md:order-1">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md glass p-10 border-white/10"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif font-bold text-gradient-gold mb-2">Create Account</h1>
            <p className="text-sm text-white/40">Join the future of legal assistance</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-neon-blue transition-colors" />
                <input 
                  required
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-neon-blue/50 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-neon-blue transition-colors" />
                <input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-neon-blue/50 outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-neon-gold transition-colors" />
                <input 
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3 text-sm focus:border-neon-gold/50 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Strength Meter */}
              <div className="flex gap-1 h-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`flex-1 rounded-full transition-colors ${i < strength ? strengthColors[strength] : 'bg-white/5'}`} />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-neon-gold transition-colors" />
                <input 
                  required
                  type="password"
                  value={formData.confirm_password}
                  onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-neon-gold/50 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer group mt-4">
              <input type="checkbox" required className="w-4 h-4 rounded border-white/10 bg-white/5 text-neon-blue focus:ring-neon-blue/20" />
              <span className="text-[10px] text-white/40 leading-tight">
                I agree to the <a href="#" className="text-neon-blue hover:underline">Terms of Service</a> and <a href="#" className="text-neon-blue hover:underline">Privacy Policy</a>
              </span>
            </label>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg mt-6"
            >
              {loading ? 'Creating Account...' : <><ArrowRight className="w-5 h-5" /> Create Account</>}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-white/40">
            Already have an account? <Link to="/login" className="text-neon-blue hover:underline">Login</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden md:flex flex-1 relative bg-dark-surface items-center justify-center p-20 overflow-hidden order-1 md:order-2">
        <div className="aurora-bg">
          <div className="aurora-blob top-[-10%] right-[-10%]" />
          <div className="aurora-blob aurora-blob-2 bottom-[-10%] left-[-10%]" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center"
        >
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-10">
            {[Shield, Scale, FileText, CheckCircle2].map((Icon, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="glass p-6 flex items-center justify-center border-white/10"
              >
                <Icon className="w-8 h-8 text-neon-blue" />
              </motion.div>
            ))}
          </div>
          <h2 className="text-4xl font-serif font-bold text-gradient-gold mb-6">Join the Revolution</h2>
          <p className="text-xl text-white/40 max-w-md mx-auto leading-relaxed italic">
            "We're building a world where legal help is a human right, powered by intelligence."
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
