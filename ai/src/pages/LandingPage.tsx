import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Scale, Shield, FileText, MessageSquare, ArrowRight } from 'lucide-react';
import TypewriterText from '../components/TypewriterText';

const LandingPage = () => {
  const stats = [
    { label: 'Cases Analyzed', value: '10,000+', icon: Scale },
    { label: 'Laws Covered', value: '50+', icon: Shield },
    { label: 'Available', value: '24/7', icon: MessageSquare },
  ];

  const tickerItems = [
    "FIR Generation", "Legal Analysis", "Document Review", "Court Guidance", "Complaint Letters",
    "FIR Generation", "Legal Analysis", "Document Review", "Court Guidance", "Complaint Letters"
  ];

  return (
    <div className="relative pt-32 overflow-hidden">
      {/* Aurora Background */}
      <div className="aurora-bg">
        <div className="aurora-blob top-[-10%] left-[-10%]" />
        <div className="aurora-blob aurora-blob-2 bottom-[-10%] right-[-10%]" />
        <div className="aurora-blob aurora-blob-3 top-[20%] right-[20%]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
            <TypewriterText
              text="Your AI-Powered Legal Defender."
              className="text-gradient-gold"
            />
          </h1>
          <p className="text-xl md:text-2xl text-white/60 mb-10 max-w-2xl mx-auto">
            Justice made accessible. Apna-Lawyer is here to guide you. Navigate the legal landscape with confidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Link to="/bot" className="btn-primary px-10 py-4 text-lg flex items-center gap-2">
              Get Legal Help <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/about" className="btn-glass px-10 py-4 text-lg">
              Learn More
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="glass p-8 flex flex-col items-center group hover:border-neon-blue/50 transition-colors"
            >
              <div className="p-4 bg-white/5 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <stat.icon className="w-8 h-8 text-neon-gold" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-white/40 font-medium uppercase tracking-wider text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ticker Tape */}
      <div className="relative w-full overflow-hidden py-10 border-y border-white/5 bg-white/2 backdrop-blur-sm">
        <div className="flex whitespace-nowrap animate-marquee">
          {tickerItems.map((item, i) => (
            <div key={i} className="flex items-center gap-4 mx-10">
              <span className="text-2xl font-serif font-bold text-white/20 uppercase tracking-widest">{item}</span>
              <div className="w-2 h-2 rounded-full bg-neon-gold/30" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
