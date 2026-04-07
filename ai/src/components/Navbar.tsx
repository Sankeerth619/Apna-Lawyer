import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Scale, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Bot', path: '/bot' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto glass px-6 py-3 flex items-center justify-between border-white/10">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-gradient-to-br from-neon-gold to-neon-blue rounded-lg group-hover:rotate-12 transition-transform">
            <Scale className="w-6 h-6 text-dark-base" />
          </div>
          <span className="text-2xl font-serif font-bold text-gradient-gold">Apna-Lawyer</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative text-sm font-medium transition-colors hover:text-neon-blue ${
                isActive(link.path) ? 'text-neon-blue' : 'text-white/70'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-neon-blue"
                />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="btn-glass py-2 px-4 flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <button onClick={() => { logout(); navigate('/'); }} className="text-white/70 hover:text-white">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-neon-gold transition-colors">Login</Link>
              <Link to="/signup" className="btn-primary py-2 px-6">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-4 right-4 glass p-6 flex flex-col gap-4 border-white/10"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium ${isActive(link.path) ? 'text-neon-blue' : 'text-white/70'}`}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-white/10" />
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-white/70">
                  <LayoutDashboard className="w-5 h-5" /> Dashboard
                </Link>
                <button onClick={() => { logout(); setIsOpen(false); navigate('/'); }} className="flex items-center gap-2 text-white/70">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <Link to="/login" onClick={() => setIsOpen(false)} className="text-center py-2">Login</Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="btn-primary text-center">Sign Up</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
