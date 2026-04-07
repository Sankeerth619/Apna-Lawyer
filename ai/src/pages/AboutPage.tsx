import React from 'react';
import { motion } from 'motion/react';
import { Shield, Target, Eye, Cpu, FileText, Search, PenTool, Clock, CheckCircle } from 'lucide-react';

const AboutPage = () => {
  const mission = [
    { title: 'Mission', icon: Target, text: 'To democratize legal access by providing instant, affordable, and intelligent legal guidance to everyone.' },
    { title: 'Vision', icon: Eye, text: 'A future where the legal system is transparent and justice is just a conversation away.' },
    { title: 'Values', icon: Shield, text: 'Integrity, accessibility, and technological excellence in every legal analysis we provide.' },
  ];

  const steps = [
    { title: 'Describe Issue', text: 'Tell Apna-Lawyer about your legal situation in plain language.' },
    { title: 'AI Analysis', text: 'Our engine parses laws and precedents relevant to your case.' },
    { title: 'Legal Roadmap', text: 'Receive a step-by-step guide on how to proceed.' },
    { title: 'Generate Docs', text: 'Instantly create FIRs, letters, and notices.' },
  ];

  const features = [
    { title: 'Legal Analysis', icon: Search, desc: 'Deep dive into IPC and other relevant Indian laws.' },
    { title: 'FIR Generator', icon: FileText, desc: 'Draft formal First Information Reports in seconds.' },
    { title: 'PDF Reader', icon: Cpu, desc: 'Upload legal documents for instant summarization.' },
    { title: 'Letter Drafting', icon: PenTool, desc: 'Create professional legal notices and complaint letters.' },
    { title: 'Court Timeline', icon: Clock, desc: 'Understand the expected duration and stages of your case.' },
    { title: 'Doc Suggestion', icon: CheckCircle, desc: 'Know exactly which documents you need for court.' },
  ];

  return (
    <div className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <section className="text-center mb-32">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif font-bold text-gradient-gold mb-6"
          >
            Democratizing Legal Access with AI
          </motion.h1>
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            Apna-Lawyer combines cutting-edge generative AI with deep legal knowledge to empower citizens and simplify the complexities of the law.
          </p>
        </section>

        {/* Mission/Vision/Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {mission.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 text-center group"
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
                <item.icon className="w-8 h-8 text-neon-gold" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4">{item.title}</h3>
              <p className="text-white/60 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <section className="mb-32">
          <h2 className="text-4xl font-serif font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 z-0" />
            
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative z-10 glass p-8 text-center"
              >
                <div className="w-10 h-10 bg-neon-blue text-dark-base font-bold rounded-full flex items-center justify-center mx-auto mb-4">
                  {i + 1}
                </div>
                <h4 className="font-bold mb-2">{step.title}</h4>
                <p className="text-sm text-white/50">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-32">
          <h2 className="text-4xl font-serif font-bold text-center mb-16">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                whileHover={{ y: -5 }}
                className="glass p-8 flex gap-6 items-start"
              >
                <div className="p-3 bg-white/5 rounded-xl">
                  <f.icon className="w-6 h-6 text-neon-blue" />
                </div>
                <div>
                  <h4 className="font-bold mb-2">{f.title}</h4>
                  <p className="text-sm text-white/50">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <div className="flex flex-wrap justify-center gap-4 mb-32">
          {['Gemini AI', 'FastAPI', 'React', 'Secure Vault', 'SQLite', 'Tailwind'].map(tech => (
            <span key={tech} className="px-6 py-2 glass rounded-full text-sm font-mono text-neon-gold border-neon-gold/20">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
