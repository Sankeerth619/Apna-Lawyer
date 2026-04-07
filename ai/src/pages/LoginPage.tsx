import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Scale } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/bot';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      login(res.data.token, res.data.user);
      toast.success("Welcome back to Apna-Lawyer!");
      navigate(from, { replace: true });
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left Side - Illustration */}
      <div className="hidden md:flex flex-1 relative bg-dark-surface items-center justify-center p-20 overflow-hidden">
        <div className="aurora-bg">
          <div className="aurora-blob top-[-10%] left-[-10%]" />
          <div className="aurora-blob aurora-blob-2 bottom-[-10%] right-[-10%]" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-neon-gold to-neon-blue rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-neon-gold/20">
            <Scale className="w-16 h-16 text-dark-base" />
          </div>
          <h2 className="text-4xl font-serif font-bold text-gradient-gold mb-6">The Future of Justice</h2>
          <p className="text-xl text-white/40 max-w-md mx-auto leading-relaxed italic">
            "Justice is not a privilege, it's a right. Apna-Lawyer ensures that right is protected by technology."
          </p>
        </motion.div>

        {/* Abstract CSS Shapes */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-neon-blue/30 rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-neon-gold/20 rounded-full animate-pulse delay-700" />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-dark-base relative">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md glass p-10 border-white/10"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif font-bold text-gradient-gold mb-2">Welcome Back</h1>
            <p className="text-sm text-white/40">Secure access to your legal assistant</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-neon-blue transition-colors" />
                <input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm focus:border-neon-blue/50 outline-none transition-all"
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-4 text-sm focus:border-neon-gold/50 outline-none transition-all"
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
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-neon-blue focus:ring-neon-blue/20" />
                <span className="text-white/40 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-neon-gold hover:underline">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg"
            >
              {loading ? 'Authenticating...' : <><ArrowRight className="w-5 h-5" /> Login</>}
            </button>
          </form>

          <div className="mt-10 text-center space-y-6">
            <div className="relative">
              <hr className="border-white/10" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark-base px-4 text-[10px] uppercase tracking-widest text-white/20">or continue with</span>
            </div>

            <button className="w-full btn-glass py-3 flex items-center justify-center gap-3 text-sm">
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale opacity-50" alt="Google" />
              Google Account
            </button>

            <p className="text-sm text-white/40">
              Don't have an account? <Link to="/signup" className="text-neon-blue hover:underline">Sign Up</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
