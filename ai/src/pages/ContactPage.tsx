import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    { label: 'Email', value: 'support@apna-lawyer.io', icon: Mail, color: 'text-neon-blue' },
    { label: 'Phone', value: '+91 800 123 4567', icon: Phone, color: 'text-neon-gold' },
    { label: 'Address', value: 'Bangalore, Kengeri 560060', icon: MapPin, color: 'text-neon-purple' },
    { label: 'Hours', value: '24/7 AI Support', icon: Clock, color: 'text-green-400' },
  ];

  const faqs = [
    { q: "Is Apna-Lawyer a replacement for a lawyer?", a: "No, Apna-Lawyer is an AI assistant designed to provide initial legal guidance and document drafting. For complex cases or representation in court, you should always consult a licensed attorney." },
    { q: "How accurate is the legal analysis?", a: "Apna-Lawyer uses advanced generative AI trained on extensive legal data. While highly accurate, it can occasionally make errors. Always verify critical information with a professional." },
    { q: "Is my data secure?", a: "Yes, we use industry-standard encryption and secure vaults to protect your personal information and case details." },
    { q: "Can I generate documents for free?", a: "We offer a limited number of free document generations. For unlimited access, consider our premium plans." },
    { q: "What laws are covered?", a: "Currently, Apna-Lawyer specializes in Indian laws, including IPC, CrPC, and various civil statutes." }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', formData);
      toast.success("Message sent successfully!");
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (e) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-serif font-bold text-gradient-gold mb-4"
          >
            Get in Touch
          </motion.h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Have questions or need technical support? Our team is here to help you navigate the future of legal assistance.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info, i) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-8 border-white/10 group hover:border-white/20 transition-colors"
                >
                  <div className={`p-3 bg-white/5 rounded-xl w-fit mb-4 ${info.color}`}>
                    <info.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">{info.label}</h4>
                  <p className="text-sm font-medium">{info.value}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="glass p-8 border-white/10 h-64 flex flex-col items-center justify-center text-center">
              <MapPin className="w-10 h-10 text-neon-gold mb-4" />
              <h4 className="font-serif font-bold text-xl mb-2">Our Headquarters</h4>
              <p className="text-white/60 text-sm">Kengeri Satellite Town<br />Bangalore, Karnataka 560060</p>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-10 border-white/10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-white/40 mb-2">Full Name</label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-blue/50 outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-white/40 mb-2">Email Address</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-blue/50 outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-white/40 mb-2">Subject</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-blue/50 outline-none appearance-none"
                >
                  <option className="bg-dark-surface">General Inquiry</option>
                  <option className="bg-dark-surface">Technical Support</option>
                  <option className="bg-dark-surface">Partnership</option>
                  <option className="bg-dark-surface">Feedback</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-white/40 mb-2">Message</label>
                <textarea 
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-blue/50 outline-none resize-none"
                  placeholder="How can we help you today?"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2"
              >
                {loading ? 'Sending...' : <><Send className="w-5 h-5" /> Send Message</>}
              </button>
            </form>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const FAQItem = ({ faq }: { faq: { q: string, a: string } }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="glass border-white/10 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-bold text-sm">{faq.q}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-neon-gold" /> : <ChevronDown className="w-5 h-5 text-white/40" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-6"
          >
            <p className="text-sm text-white/60 leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactPage;
